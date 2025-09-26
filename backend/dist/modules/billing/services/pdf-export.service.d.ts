import { Repository } from 'typeorm';
import { Invoice } from '../../database/entities/billing.entity';
import { Customer } from '../../database/entities/customer.entity';
export declare class PdfExportService {
    private readonly invoiceRepo;
    private readonly customerRepo;
    constructor(invoiceRepo: Repository<Invoice>, customerRepo: Repository<Customer>);
    generateInvoicePdf(invoiceId: string): Promise<string>;
    private generateInvoiceHtml;
    private getStatusText;
    generateInvoicesCsv(invoiceIds: string[]): Promise<string>;
}
