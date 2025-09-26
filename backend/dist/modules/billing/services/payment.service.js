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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("../../database/entities/billing.entity");
let PaymentService = class PaymentService {
    constructor(paymentRepo, invoiceRepo) {
        this.paymentRepo = paymentRepo;
        this.invoiceRepo = invoiceRepo;
    }
    async findAll(invoiceId, customerId, from, to) {
        const query = this.paymentRepo
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.invoice', 'invoice')
            .orderBy('payment.paidAt', 'DESC');
        if (invoiceId) {
            query.andWhere('payment.invoiceId = :invoiceId', { invoiceId });
        }
        if (customerId) {
            query.andWhere('invoice.customerId = :customerId', { customerId });
        }
        if (from) {
            query.andWhere('payment.paidAt >= :from', { from });
        }
        if (to) {
            query.andWhere('payment.paidAt <= :to', { to });
        }
        return query.getMany();
    }
    async findOne(id) {
        const payment = await this.paymentRepo.findOne({
            where: { id },
            relations: ['invoice'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async create(dto) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id: dto.invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        const totalPaid = await this.getTotalPaidAmount(dto.invoiceId);
        const remainingBalance = invoice.total - totalPaid;
        if (dto.amount > remainingBalance) {
            throw new Error(`Payment amount (${dto.amount}) exceeds remaining balance (${remainingBalance})`);
        }
        const payment = this.paymentRepo.create({
            invoiceId: dto.invoiceId,
            method: dto.method,
            amount: dto.amount,
            reference: dto.reference,
            notes: dto.notes,
            paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
        });
        const savedPayment = await this.paymentRepo.save(payment);
        const newTotalPaid = totalPaid + dto.amount;
        if (newTotalPaid >= invoice.total) {
            await this.invoiceRepo.update(dto.invoiceId, {
                status: 'PAID',
            });
        }
        else if (newTotalPaid > 0) {
            await this.invoiceRepo.update(dto.invoiceId, {
                status: 'PARTIAL',
            });
        }
        return this.findOne(savedPayment.id);
    }
    async refund(id, refundDto) {
        const payment = await this.findOne(id);
        if (refundDto.amount > payment.amount) {
            throw new Error('Refund amount cannot exceed payment amount');
        }
        const refund = this.paymentRepo.create({
            invoiceId: payment.invoiceId,
            method: `REFUND_${payment.method}`,
            amount: -refundDto.amount,
            reference: `REF-${payment.reference}`,
            notes: `Refund for payment ${payment.id}: ${refundDto.reason}`,
            paidAt: new Date(),
        });
        await this.paymentRepo.save(refund);
        const totalPaid = await this.getTotalPaidAmount(payment.invoiceId);
        const invoice = await this.invoiceRepo.findOne({
            where: { id: payment.invoiceId },
        });
        if (totalPaid <= 0) {
            await this.invoiceRepo.update(payment.invoiceId, {
                status: 'OPEN',
            });
        }
        else if (totalPaid < invoice.total) {
            await this.invoiceRepo.update(payment.invoiceId, {
                status: 'PARTIAL',
            });
        }
        return {
            message: `Refund of ${refundDto.amount} processed successfully`,
        };
    }
    async getTotalPaidAmount(invoiceId) {
        const result = await this.paymentRepo
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.invoiceId = :invoiceId', { invoiceId })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getPaymentSummary(customerId, from, to) {
        const query = this.paymentRepo
            .createQueryBuilder('payment')
            .leftJoin('payment.invoice', 'invoice')
            .where('invoice.customerId = :customerId', { customerId });
        if (from) {
            query.andWhere('payment.paidAt >= :from', { from });
        }
        if (to) {
            query.andWhere('payment.paidAt <= :to', { to });
        }
        const payments = await query.getMany();
        const summary = payments.reduce((acc, payment) => {
            acc.totalAmount += payment.amount;
            acc.totalPayments += 1;
            if (!acc.methods[payment.method]) {
                acc.methods[payment.method] = 0;
            }
            acc.methods[payment.method] += payment.amount;
            return acc;
        }, {
            totalAmount: 0,
            totalPayments: 0,
            methods: {},
        });
        return {
            summary,
            payments: payments.slice(0, 10),
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(billing_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map