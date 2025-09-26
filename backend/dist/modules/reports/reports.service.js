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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../database/entities");
let ReportsService = class ReportsService {
    constructor(orderRepository, inventoryRepository, itemRepository, customerRepository, invoiceRepository, paymentRepository) {
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.itemRepository = itemRepository;
        this.customerRepository = customerRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
    }
    async getDashboard() {
        const [totalCustomers, totalOrders, totalInventory, totalRevenue,] = await Promise.all([
            this.customerRepository.count(),
            this.orderRepository.count(),
            this.inventoryRepository.count(),
            this.getTotalRevenue(),
        ]);
        return {
            overview: {
                totalCustomers,
                totalOrders,
                totalInventory,
                totalRevenue,
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
        return {
            inventories,
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
        return {
            orders,
            metrics: {
                totalOrders: orders.length,
                totalValue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
                totalItems: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0),
            },
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
        return {
            invoices,
            financials: {
                totalInvoiced: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
                totalPaid: invoices.reduce((sum, invoice) => sum + invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0),
                totalOutstanding: invoices.reduce((sum, invoice) => sum + (invoice.total - invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0)), 0),
            },
        };
    }
    async getPerformanceKPIs(period, customerId) {
        return {
            period,
            kpis: {
                orderFulfillmentRate: 95.5,
                inventoryTurnover: 6.2,
                averageOrderValue: 450.75,
                customerSatisfaction: 4.3,
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
    async getOrderTrends() {
        return [];
    }
    async getRevenueTrends() {
        return [];
    }
    async getInventoryLevels() {
        return [];
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
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
], ReportsService);
//# sourceMappingURL=reports.service.js.map