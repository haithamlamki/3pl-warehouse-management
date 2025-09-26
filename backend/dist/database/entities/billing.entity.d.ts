import { Customer } from './customer.entity';
export declare class UnbilledTxn {
    id: string;
    tenantId: string;
    customerId: string;
    refType: string;
    refId: string;
    serviceType: string;
    qty: number;
    uom: string;
    rate: number;
    amount: number;
    ts: Date;
    description: string;
    billed: boolean;
    invoiceId: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
}
export declare class Invoice {
    id: string;
    tenantId: string;
    customerId: string;
    periodFrom: Date;
    periodTo: Date;
    currency: string;
    total: number;
    tax: number;
    subtotal: number;
    status: string;
    invoiceNumber: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    lines: InvoiceLine[];
    payments: Payment[];
}
export declare class InvoiceLine {
    id: string;
    invoiceId: string;
    description: string;
    serviceType: string;
    qty: number;
    uom: string;
    rate: number;
    tax: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    invoice: Invoice;
}
export declare class Payment {
    id: string;
    invoiceId: string;
    method: string;
    amount: number;
    paidAt: Date;
    reference: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    invoice: Invoice;
}
