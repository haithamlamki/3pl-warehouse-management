import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    findAll(invoiceId?: string, customerId?: string, from?: string, to?: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto): Promise<Payment>;
    refund(id: string, refundDto: any): Promise<{
        message: string;
    }>;
}
