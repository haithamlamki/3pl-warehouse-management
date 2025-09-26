import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';
import { UnbilledTxn } from '../../database/entities/billing.entity';
import { InvoiceService } from './invoice.service';
import { UnbilledTxnService } from './unbilled-txn.service';
export interface BatchBillingResult {
    period: string;
    totalCustomers: number;
    totalInvoices: number;
    totalAmount: number;
    results: CustomerBillingResult[];
    errors: BillingError[];
}
export interface CustomerBillingResult {
    customerId: string;
    customerName: string;
    invoiceId?: string;
    invoiceNumber?: string;
    totalAmount: number;
    transactionCount: number;
    success: boolean;
    error?: string;
}
export interface BillingError {
    customerId: string;
    customerName: string;
    error: string;
}
export declare class BatchBillingService {
    private readonly customerRepo;
    private readonly unbilledTxnRepo;
    private readonly invoiceService;
    private readonly unbilledTxnService;
    constructor(customerRepo: Repository<Customer>, unbilledTxnRepo: Repository<UnbilledTxn>, invoiceService: InvoiceService, unbilledTxnService: UnbilledTxnService);
    runMonthlyBilling(period: string): Promise<BatchBillingResult>;
    private processCustomerBilling;
    getBillingSummary(period: string): Promise<{
        period: string;
        totalUnbilledAmount: number;
        totalUnbilledTransactions: number;
        customersWithUnbilledTxns: number;
        customerSummaries: Array<{
            customerId: string;
            customerName: string;
            unbilledAmount: number;
            transactionCount: number;
        }>;
    }>;
}
