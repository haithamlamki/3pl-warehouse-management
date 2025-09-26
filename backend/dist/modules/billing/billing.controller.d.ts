import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getUnbilledTransactions(customerId?: string, from?: string, to?: string): Promise<any>;
    getBillingDashboard(): Promise<any>;
}
