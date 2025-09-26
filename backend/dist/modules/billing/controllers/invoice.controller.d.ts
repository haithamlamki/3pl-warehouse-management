import { Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { PdfExportService } from '../services/pdf-export.service';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    private readonly pdfExportService;
    constructor(invoiceService: InvoiceService, pdfExportService: PdfExportService);
    findAll(customerId?: string, status?: string, from?: string, to?: string): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice>;
    generate(dto: GenerateInvoiceDto): Promise<Invoice>;
    generatePurchaseForClientInvoice(orderId: string): Promise<Invoice>;
    send(id: string): Promise<{
        message: string;
    }>;
    generatePdf(id: string, res: Response): Promise<void>;
    exportCsv(body: {
        invoiceIds: string[];
    }, res: Response): Promise<void>;
}
