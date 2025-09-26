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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("../../database/entities/billing.entity");
const customer_entity_1 = require("../../database/entities/customer.entity");
let BillingService = class BillingService {
    constructor(unbilledTxnRepo, customerRepo) {
        this.unbilledTxnRepo = unbilledTxnRepo;
        this.customerRepo = customerRepo;
    }
    async getUnbilledTransactions(customerId, from, to) {
        const query = this.unbilledTxnRepo
            .createQueryBuilder('unbilled')
            .leftJoinAndSelect('unbilled.customer', 'customer')
            .orderBy('unbilled.ts', 'DESC');
        if (customerId) {
            query.andWhere('unbilled.customerId = :customerId', { customerId });
        }
        if (from) {
            query.andWhere('unbilled.ts >= :from', { from });
        }
        if (to) {
            query.andWhere('unbilled.ts <= :to', { to });
        }
        const transactions = await query.getMany();
        const groupedByCustomer = transactions.reduce((acc, txn) => {
            const customerId = txn.customerId;
            if (!acc[customerId]) {
                acc[customerId] = {
                    customer: txn.customer,
                    transactions: [],
                    totalAmount: 0,
                };
            }
            acc[customerId].transactions.push(txn);
            acc[customerId].totalAmount += txn.amount || 0;
            return acc;
        }, {});
        return {
            summary: {
                totalCustomers: Object.keys(groupedByCustomer).length,
                totalTransactions: transactions.length,
                totalAmount: transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0),
            },
            customers: Object.values(groupedByCustomer),
        };
    }
    async getBillingDashboard() {
        const totalCustomers = await this.customerRepo.count();
        const unbilledStats = await this.unbilledTxnRepo
            .createQueryBuilder('unbilled')
            .select([
            'COUNT(*) as totalTransactions',
            'SUM(unbilled.amount) as totalAmount',
            'COUNT(DISTINCT unbilled.customerId) as totalCustomers',
        ])
            .getRawOne();
        return {
            overview: {
                totalCustomers,
                unbilledTransactions: parseInt(unbilledStats.totalTransactions) || 0,
                unbilledAmount: parseFloat(unbilledStats.totalAmount) || 0,
                customersWithUnbilled: parseInt(unbilledStats.totalCustomers) || 0,
            },
            recentActivity: await this.getRecentActivity(),
        };
    }
    async getRecentActivity() {
        return this.unbilledTxnRepo
            .createQueryBuilder('unbilled')
            .leftJoinAndSelect('unbilled.customer', 'customer')
            .orderBy('unbilled.ts', 'DESC')
            .limit(10)
            .getMany();
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.UnbilledTxn)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BillingService);
//# sourceMappingURL=billing.service.js.map