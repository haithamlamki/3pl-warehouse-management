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
exports.BatchBillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../database/entities/customer.entity");
const billing_entity_1 = require("../../database/entities/billing.entity");
const invoice_service_1 = require("./invoice.service");
const unbilled_txn_service_1 = require("./unbilled-txn.service");
let BatchBillingService = class BatchBillingService {
    constructor(customerRepo, unbilledTxnRepo, invoiceService, unbilledTxnService) {
        this.customerRepo = customerRepo;
        this.unbilledTxnRepo = unbilledTxnRepo;
        this.invoiceService = invoiceService;
        this.unbilledTxnService = unbilledTxnService;
    }
    async runMonthlyBilling(period) {
        const [year, month] = period.split('-').map(Number);
        const from = new Date(year, month - 1, 1);
        const to = new Date(year, month, 0, 23, 59, 59, 999);
        console.log(`Running monthly billing for period ${period} (${from.toISOString()} to ${to.toISOString()})`);
        const customers = await this.customerRepo.find({
            where: { status: 'active' },
        });
        const results = [];
        const errors = [];
        let totalInvoices = 0;
        let totalAmount = 0;
        for (const customer of customers) {
            try {
                const result = await this.processCustomerBilling(customer, from, to);
                results.push(result);
                if (result.success) {
                    totalInvoices++;
                    totalAmount += result.totalAmount;
                }
                else {
                    errors.push({
                        customerId: customer.id,
                        customerName: customer.name,
                        error: result.error || 'Unknown error',
                    });
                }
            }
            catch (error) {
                console.error(`Error processing billing for customer ${customer.id}:`, error);
                errors.push({
                    customerId: customer.id,
                    customerName: customer.name,
                    error: error.message,
                });
            }
        }
        return {
            period,
            totalCustomers: customers.length,
            totalInvoices,
            totalAmount,
            results,
            errors,
        };
    }
    async processCustomerBilling(customer, from, to) {
        const unbilledTxns = await this.unbilledTxnService.getUnbilledTxns(customer.id, from, to);
        if (unbilledTxns.length === 0) {
            return {
                customerId: customer.id,
                customerName: customer.name,
                totalAmount: 0,
                transactionCount: 0,
                success: true,
            };
        }
        try {
            const invoice = await this.invoiceService.generate({
                customerId: customer.id,
                periodFrom: from.toISOString(),
                periodTo: to.toISOString(),
            });
            return {
                customerId: customer.id,
                customerName: customer.name,
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                totalAmount: invoice.totalAmount,
                transactionCount: unbilledTxns.length,
                success: true,
            };
        }
        catch (error) {
            return {
                customerId: customer.id,
                customerName: customer.name,
                totalAmount: 0,
                transactionCount: unbilledTxns.length,
                success: false,
                error: error.message,
            };
        }
    }
    async getBillingSummary(period) {
        const [year, month] = period.split('-').map(Number);
        const from = new Date(year, month - 1, 1);
        const to = new Date(year, month, 0, 23, 59, 59, 999);
        const unbilledTxns = await this.unbilledTxnRepo.find({
            where: {
                billed: false,
                ts: {
                    $gte: from,
                    $lte: to,
                },
            },
            relations: ['customer'],
        });
        const customerMap = new Map();
        let totalUnbilledAmount = 0;
        let totalUnbilledTransactions = 0;
        for (const txn of unbilledTxns) {
            const customerId = txn.customerId;
            const customerName = txn.customer?.name || 'Unknown Customer';
            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    customerId,
                    customerName,
                    unbilledAmount: 0,
                    transactionCount: 0,
                });
            }
            const customerSummary = customerMap.get(customerId);
            customerSummary.unbilledAmount += txn.amount || 0;
            customerSummary.transactionCount++;
            totalUnbilledAmount += txn.amount || 0;
            totalUnbilledTransactions++;
        }
        return {
            period,
            totalUnbilledAmount,
            totalUnbilledTransactions,
            customersWithUnbilledTxns: customerMap.size,
            customerSummaries: Array.from(customerMap.values()),
        };
    }
};
exports.BatchBillingService = BatchBillingService;
exports.BatchBillingService = BatchBillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(billing_entity_1.UnbilledTxn)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        invoice_service_1.InvoiceService,
        unbilled_txn_service_1.UnbilledTxnService])
], BatchBillingService);
//# sourceMappingURL=batch-billing.service.js.map