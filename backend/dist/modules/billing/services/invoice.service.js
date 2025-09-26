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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("../../database/entities/billing.entity");
const customer_entity_1 = require("../../database/entities/customer.entity");
const rate_card_entity_1 = require("../../database/entities/rate-card.entity");
const order_entity_1 = require("../../database/entities/order.entity");
const pricing_engine_service_1 = require("./pricing-engine.service");
let InvoiceService = class InvoiceService {
    constructor(invoiceRepo, invoiceLineRepo, unbilledTxnRepo, customerRepo, rateCardRepo, orderRepo, orderLineRepo, pricingEngine) {
        this.invoiceRepo = invoiceRepo;
        this.invoiceLineRepo = invoiceLineRepo;
        this.unbilledTxnRepo = unbilledTxnRepo;
        this.customerRepo = customerRepo;
        this.rateCardRepo = rateCardRepo;
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
        this.pricingEngine = pricingEngine;
    }
    async findAll(customerId, status, from, to) {
        const query = this.invoiceRepo
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .leftJoinAndSelect('invoice.lines', 'lines')
            .orderBy('invoice.createdAt', 'DESC');
        if (customerId) {
            query.andWhere('invoice.customerId = :customerId', { customerId });
        }
        if (status) {
            query.andWhere('invoice.status = :status', { status });
        }
        if (from) {
            query.andWhere('invoice.periodFrom >= :from', { from });
        }
        if (to) {
            query.andWhere('invoice.periodTo <= :to', { to });
        }
        return query.getMany();
    }
    async findOne(id) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id },
            relations: ['customer', 'lines', 'payments'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async generate(dto) {
        const customer = await this.customerRepo.findOne({
            where: { id: dto.customerId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const unbilledTxns = await this.unbilledTxnRepo
            .createQueryBuilder('txn')
            .where('txn.customerId = :customerId', { customerId: dto.customerId })
            .andWhere('txn.ts >= :from', { from: new Date(dto.periodFrom) })
            .andWhere('txn.ts <= :to', { to: new Date(dto.periodTo) })
            .andWhere('(txn.billed IS DISTINCT FROM TRUE)')
            .orderBy('txn.ts', 'ASC')
            .getMany();
        if (unbilledTxns.length === 0) {
            throw new Error('No unbilled transactions found for the specified period');
        }
        const invoice = this.invoiceRepo.create({
            tenantId: dto.tenantId,
            customerId: dto.customerId,
            periodFrom: new Date(dto.periodFrom),
            periodTo: new Date(dto.periodTo),
            currency: dto.currency || 'USD',
            status: 'OPEN',
            invoiceNumber: await this.generateInvoiceNumber(),
        });
        const savedInvoice = await this.invoiceRepo.save(invoice);
        const rateCard = await this.rateCardRepo.findOne({
            where: { customerId: dto.customerId, active: true },
            relations: ['rules'],
        });
        let subtotal = 0;
        const invoiceLines = [];
        for (const txn of unbilledTxns) {
            const pricing = rateCard
                ? await this.pricingEngine.calculatePrice(rateCard, txn.serviceType, Number(txn.qty), txn.uom)
                : { finalPrice: txn.amount ?? 0 };
            const line = this.invoiceLineRepo.create({
                invoiceId: savedInvoice.id,
                description: `${txn.serviceType} - ${txn.description || 'Service'}`,
                serviceType: txn.serviceType,
                qty: txn.qty,
                uom: txn.uom,
                rate: pricing?.appliedRule?.price ?? txn.rate ?? 0,
                amount: pricing?.finalPrice ?? txn.amount ?? 0,
            });
            invoiceLines.push(line);
            subtotal += Number(line.amount) || 0;
        }
        await this.invoiceLineRepo.save(invoiceLines);
        const taxRate = dto.taxRate || 0;
        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;
        await this.invoiceRepo.update(savedInvoice.id, {
            subtotal,
            tax,
            total,
        });
        await this.unbilledTxnRepo
            .createQueryBuilder()
            .update()
            .set({ billed: true, invoiceId: savedInvoice.id })
            .whereInIds(unbilledTxns.map((t) => t.id))
            .execute();
        return this.findOne(savedInvoice.id);
    }
    async send(id) {
        const invoice = await this.findOne(id);
        console.log(`Sending invoice ${invoice.invoiceNumber} to customer ${invoice.customerId}`);
        return {
            message: `Invoice ${invoice.invoiceNumber} sent successfully`,
        };
    }
    async generatePdf(id) {
        const invoice = await this.findOne(id);
        const mockPdfContent = `
      Invoice: ${invoice.invoiceNumber}
      Customer: ${invoice.customer?.name}
      Period: ${invoice.periodFrom} - ${invoice.periodTo}
      Total: ${invoice.currency} ${invoice.total}
    `;
        return Buffer.from(mockPdfContent);
    }
    async generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const count = await this.invoiceRepo.count({
            where: {
                createdAt: {
                    $gte: new Date(year, new Date().getMonth(), 1),
                    $lt: new Date(year, new Date().getMonth() + 1, 1),
                },
            },
        });
        const sequence = (count + 1).toString().padStart(4, '0');
        return `INV-${year}${month}-${sequence}`;
    }
    async generatePurchaseForClientInvoice(orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['customer', 'lines', 'lines.item'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.ownerTypeEffective !== order_entity_1.OwnerTypeEffective.PURCHASE_FOR_CLIENT) {
            throw new Error('Order is not of type PURCHASE_FOR_CLIENT');
        }
        if (order.status !== 'DELIVERED') {
            throw new Error('Order must be delivered before generating invoice');
        }
        const rateCard = await this.rateCardRepo.findOne({
            where: { customerId: order.customerId, active: true },
            relations: ['rules'],
        });
        if (!rateCard) {
            throw new common_1.NotFoundException('Active rate card not found for this customer');
        }
        const invoice = this.invoiceRepo.create({
            customerId: order.customerId,
            invoiceNumber: `INV-${Date.now()}`,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'DRAFT',
            subtotal: 0,
            taxAmount: 0,
            totalAmount: 0,
        });
        const savedInvoice = await this.invoiceRepo.save(invoice);
        let subtotal = 0;
        const invoiceLines = [];
        for (const orderLine of order.lines) {
            if (orderLine.unitPrice && orderLine.unitPrice > 0) {
                const saleAmount = orderLine.qty * orderLine.unitPrice;
                const saleLine = this.invoiceLineRepo.create({
                    invoiceId: savedInvoice.id,
                    description: `بيع ${orderLine.item?.name || orderLine.itemSku}`,
                    serviceType: 'SALE',
                    qty: orderLine.qty,
                    uom: orderLine.item?.uom || 'PCS',
                    rate: orderLine.unitPrice,
                    amount: saleAmount,
                });
                invoiceLines.push(saleLine);
                subtotal += saleAmount;
            }
            const serviceTypes = ['STORAGE', 'PICKING', 'PACKING', 'DELIVERY'];
            for (const serviceType of serviceTypes) {
                try {
                    const pricingResult = await this.pricingEngine.calculatePrice(rateCard, serviceType, orderLine.qty, orderLine.item?.uom || 'PCS');
                    if (pricingResult.finalPrice > 0) {
                        const serviceLine = this.invoiceLineRepo.create({
                            invoiceId: savedInvoice.id,
                            description: `${serviceType} - ${orderLine.item?.name || orderLine.itemSku}`,
                            serviceType,
                            qty: orderLine.qty,
                            uom: orderLine.item?.uom || 'PCS',
                            rate: pricingResult.appliedRule?.price || 0,
                            amount: pricingResult.finalPrice,
                        });
                        invoiceLines.push(serviceLine);
                        subtotal += pricingResult.finalPrice;
                    }
                }
                catch (error) {
                    console.warn(`Could not calculate price for ${serviceType}: ${error.message}`);
                }
            }
        }
        await this.invoiceLineRepo.save(invoiceLines);
        const taxRate = 0.15;
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;
        await this.invoiceRepo.update(savedInvoice.id, {
            subtotal,
            taxAmount,
            totalAmount,
            status: 'FINAL',
        });
        return this.findOne(savedInvoice.id);
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(billing_entity_1.InvoiceLine)),
    __param(2, (0, typeorm_1.InjectRepository)(billing_entity_1.UnbilledTxn)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(4, (0, typeorm_1.InjectRepository)(rate_card_entity_1.RateCard)),
    __param(5, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(6, (0, typeorm_1.InjectRepository)(order_entity_1.OrderLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        pricing_engine_service_1.PricingEngineService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map