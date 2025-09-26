import { Repository } from 'typeorm';
import { Payment, Invoice } from '../../database/entities/billing.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
export declare class PaymentService {
    private readonly paymentRepo;
    private readonly invoiceRepo;
    constructor(paymentRepo: Repository<Payment>, invoiceRepo: Repository<Invoice>);
    findAll(invoiceId?: string, customerId?: string, from?: string, to?: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto): Promise<Payment>;
    refund(id: string, refundDto: any): Promise<{
        message: string;
    }>;
    private getTotalPaidAmount;
    getPaymentSummary(customerId: string, from?: string, to?: string): Promise<{
        summary: Payment;
        payments: Payment[];
    }>;
}
