import { BatchBillingService } from '../services/batch-billing.service';
export declare class BatchBillingController {
    private readonly batchBillingService;
    constructor(batchBillingService: BatchBillingService);
    runMonthlyBilling(period: string): Promise<import("../services/batch-billing.service").BatchBillingResult>;
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
