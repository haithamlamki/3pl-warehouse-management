export declare class CreatePaymentDto {
    invoiceId: string;
    method: string;
    amount: number;
    reference?: string;
    notes?: string;
    paidAt?: string;
}
