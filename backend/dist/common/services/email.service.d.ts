import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
export interface EmailOptions {
    to: string | string[];
    subject: string;
    template?: string;
    context?: any;
    html?: string;
    text?: string;
    attachments?: any[];
}
export declare class EmailService {
    private readonly configService;
    private emailQueue;
    private transporter;
    constructor(configService: ConfigService, emailQueue: Queue);
    sendEmail(options: EmailOptions): Promise<void>;
    queueEmail(options: EmailOptions): Promise<void>;
    sendContractSignatureRequest(customerEmail: string, contractId: string, contractUrl: string): Promise<void>;
    sendOrderStatusNotification(customerEmail: string, orderId: string, status: string): Promise<void>;
    sendInvoiceNotification(customerEmail: string, invoiceId: string, amount: number, invoiceUrl: string): Promise<void>;
}
