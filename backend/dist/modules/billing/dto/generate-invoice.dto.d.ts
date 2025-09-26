export declare class GenerateInvoiceDto {
    tenantId: string;
    customerId: string;
    periodFrom: string;
    periodTo: string;
    currency?: string;
    taxRate?: number;
}
