import { Repository } from 'typeorm';
import { UnbilledTxn } from '../../database/entities/billing.entity';
import { Customer } from '../../database/entities/customer.entity';
export declare class BillingService {
    private readonly unbilledTxnRepo;
    private readonly customerRepo;
    constructor(unbilledTxnRepo: Repository<UnbilledTxn>, customerRepo: Repository<Customer>);
    getUnbilledTransactions(customerId?: string, from?: string, to?: string): Promise<{
        summary: {
            totalCustomers: number;
            totalTransactions: number;
            totalAmount: UnbilledTxn;
        };
        customers: unknown[];
    }>;
    getBillingDashboard(): Promise<{
        overview: {
            totalCustomers: number;
            unbilledTransactions: number;
            unbilledAmount: number;
            customersWithUnbilled: number;
        };
        recentActivity: UnbilledTxn[];
    }>;
    private getRecentActivity;
}
