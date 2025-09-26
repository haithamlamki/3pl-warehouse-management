import { Repository } from 'typeorm';
import { Invoice, InvoiceLine, UnbilledTxn } from '../../database/entities/billing.entity';
import { Customer } from '../../database/entities/customer.entity';
import { RateCard } from '../../database/entities/rate-card.entity';
import { Order, OrderLine } from '../../database/entities/order.entity';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { PricingEngineService } from './pricing-engine.service';
export declare class InvoiceService {
    private readonly invoiceRepo;
    private readonly invoiceLineRepo;
    private readonly unbilledTxnRepo;
    private readonly customerRepo;
    private readonly rateCardRepo;
    private readonly orderRepo;
    private readonly orderLineRepo;
    private readonly pricingEngine;
    constructor(invoiceRepo: Repository<Invoice>, invoiceLineRepo: Repository<InvoiceLine>, unbilledTxnRepo: Repository<UnbilledTxn>, customerRepo: Repository<Customer>, rateCardRepo: Repository<RateCard>, orderRepo: Repository<Order>, orderLineRepo: Repository<OrderLine>, pricingEngine: PricingEngineService);
    findAll(customerId?: string, status?: string, from?: string, to?: string): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice>;
    generate(dto: GenerateInvoiceDto): Promise<Invoice>;
    send(id: string): Promise<{
        message: string;
    }>;
    generatePdf(id: string): Promise<Buffer>;
    private generateInvoiceNumber;
    generatePurchaseForClientInvoice(orderId: string): Promise<Invoice>;
}
