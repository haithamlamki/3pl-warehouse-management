"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
let ReportingService = class ReportingService {
    constructor(orderRepository, inventoryRepository, itemRepository, customerRepository, invoiceRepository, paymentRepository) {
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.itemRepository = itemRepository;
        this.customerRepository = customerRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
    }
    async getDashboard() {
        const [totalCustomers, totalOrders, totalInventory, totalRevenue, recentOrders, topCustomers,] = await Promise.all([
            this.customerRepository.count(),
            this.orderRepository.count(),
            this.inventoryRepository.count(),
            this.getTotalRevenue(),
            this.getRecentOrders(),
            this.getTopCustomers(),
        ]);
        return {
            overview: {
                totalCustomers,
                totalOrders,
                totalInventory,
                totalRevenue,
            },
            recentActivity: {
                orders: recentOrders,
                topCustomers,
            },
            charts: {
                orderTrends: await this.getOrderTrends(),
                revenueTrends: await this.getRevenueTrends(),
                inventoryLevels: await this.getInventoryLevels(),
            },
        };
    }
    async getInventoryReports(customerId, warehouseId, from, to) {
        const query = this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.item', 'item')
            .leftJoinAndSelect('inventory.customer', 'customer')
            .leftJoinAndSelect('inventory.warehouse', 'warehouse');
        if (customerId) {
            query.andWhere('inventory.customerId = :customerId', { customerId });
        }
        if (warehouseId) {
            query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
        }
        if (from && to) {
            query.andWhere('inventory.updatedAt BETWEEN :from AND :to', { from, to });
        }
        const inventories = await query.getMany();
        const summary = inventories.reduce((acc, inv) => {
            const key = `${inv.customerId}-${inv.warehouseId}`;
            if (!acc[key]) {
                acc[key] = {
                    customer: inv.customer,
                    warehouse: inv.warehouse,
                    totalItems: 0,
                    totalValue: 0,
                    items: [],
                };
            }
            acc[key].totalItems += inv.qty;
            acc[key].totalValue += (inv.qty * (inv.item?.unitPrice || 0));
            acc[key].items.push(inv);
            return acc;
        }, {});
        return {
            summary: Object.values(summary),
            details: inventories,
            totals: {
                totalItems: inventories.reduce((sum, inv) => sum + inv.qty, 0),
                totalValue: inventories.reduce((sum, inv) => sum + (inv.qty * (inv.item?.unitPrice || 0)), 0),
            },
        };
    }
    async getOrderReports(customerId, status, from, to) {
        const query = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.item', 'item');
        if (customerId) {
            query.andWhere('order.customerId = :customerId', { customerId });
        }
        if (status) {
            query.andWhere('order.status = :status', { status });
        }
        if (from && to) {
            query.andWhere('order.createdAt BETWEEN :from AND :to', { from, to });
        }
        const orders = await query.getMany();
        const metrics = orders.reduce((acc, order) => {
            acc.totalOrders += 1;
            acc.totalValue += order.totalAmount || 0;
            acc.totalItems += order.items.reduce((sum, item) => sum + item.qty, 0);
            if (!acc.statusCounts[order.status]) {
                acc.statusCounts[order.status] = 0;
            }
            acc.statusCounts[order.status] += 1;
            return acc;
        }, {
            totalOrders: 0,
            totalValue: 0,
            totalItems: 0,
            statusCounts: {},
        });
        return {
            orders,
            metrics,
            trends: await this.getOrderTrends(from, to),
        };
    }
    async getFinancialReports(customerId, from, to) {
        const query = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .leftJoinAndSelect('invoice.payments', 'payments');
        if (customerId) {
            query.andWhere('invoice.customerId = :customerId', { customerId });
        }
        if (from && to) {
            query.andWhere('invoice.createdAt BETWEEN :from AND :to', { from, to });
        }
        const invoices = await query.getMany();
        const financials = invoices.reduce((acc, invoice) => {
            acc.totalInvoiced += invoice.total;
            acc.totalPaid += invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
            acc.totalOutstanding += invoice.total - invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
            if (!acc.statusCounts[invoice.status]) {
                acc.statusCounts[invoice.status] = 0;
            }
            acc.statusCounts[invoice.status] += 1;
            return acc;
        }, {
            totalInvoiced: 0,
            totalPaid: 0,
            totalOutstanding: 0,
            statusCounts: {},
        });
        return {
            invoices,
            financials,
            trends: await this.getRevenueTrends(from, to),
        };
    }
    async getPerformanceKPIs(period, customerId) {
        const dateRange = this.getDateRange(period);
        const [orderFulfillmentRate, inventoryTurnover, averageOrderValue, customerSatisfaction,] = await Promise.all([
            this.getOrderFulfillmentRate(dateRange, customerId),
            this.getInventoryTurnover(dateRange, customerId),
            this.getAverageOrderValue(dateRange, customerId),
            this.getCustomerSatisfaction(dateRange, customerId),
        ]);
        return {
            period,
            kpis: {
                orderFulfillmentRate,
                inventoryTurnover,
                averageOrderValue,
                customerSatisfaction,
            },
            benchmarks: {
                industryAverage: {
                    orderFulfillmentRate: 95,
                    inventoryTurnover: 6,
                    averageOrderValue: 500,
                    customerSatisfaction: 4.2,
                },
            },
        };
    }
    async getTotalRevenue() {
        const result = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .select('SUM(invoice.total)', 'total')
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getRecentOrders() {
        return this.orderRepository.find({
            take: 10,
            order: { createdAt: 'DESC' },
            relations: ['customer'],
        });
    }
    async getTopCustomers() {
        return this.customerRepository
            .createQueryBuilder('customer')
            .leftJoin('customer.orders', 'order')
            .select([
            'customer.id',
            'customer.name',
            'SUM(order.totalAmount) as totalValue',
            'COUNT(order.id) as orderCount',
        ])
            .groupBy('customer.id')
            .orderBy('totalValue', 'DESC')
            .limit(5)
            .getRawMany();
    }
    async getOrderTrends(from, to) {
        return [];
    }
    async getRevenueTrends(from, to) {
        return [];
    }
    async getInventoryLevels() {
        return [];
    }
    getDateRange(period) {
        const now = new Date();
        const start = new Date();
        switch (period) {
            case 'week':
                start.setDate(now.getDate() - 7);
                break;
            case 'month':
                start.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                start.setFullYear(now.getFullYear() - 1);
                break;
            default:
                start.setMonth(now.getMonth() - 1);
        }
        return { start, end: now };
    }
    async getOrderFulfillmentRate(dateRange, customerId) {
        return 95.5;
    }
    async getInventoryTurnover(dateRange, customerId) {
        return 6.2;
    }
    async getAverageOrderValue(dateRange, customerId) {
        return 450.75;
    }
    async getCustomerSatisfaction(dateRange, customerId) {
        return 4.3;
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Inventory)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Item)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Invoice)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportingService);
//# sourceMappingURL=reporting.service.js.map