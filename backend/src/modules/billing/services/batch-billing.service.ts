import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class BatchBillingService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    private readonly invoiceService: InvoiceService,
    private readonly unbilledTxnService: UnbilledTxnService,
  ) {}

  /**
   * Run monthly billing cycle for all customers
   */
  async runMonthlyBilling(period: string): Promise<BatchBillingResult> {
    // Parse period (YYYY-MM)
    const [year, month] = period.split('-').map(Number);
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);

    console.log(`Running monthly billing for period ${period} (${from.toISOString()} to ${to.toISOString()})`);

    // Get all active customers
    const customers = await this.customerRepo.find({
      where: { status: 'active' },
    });

    const results: CustomerBillingResult[] = [];
    const errors: BillingError[] = [];
    let totalInvoices = 0;
    let totalAmount = 0;

    for (const customer of customers) {
      try {
        const result = await this.processCustomerBilling(customer, from, to);
        results.push(result);
        
        if (result.success) {
          totalInvoices++;
          totalAmount += result.totalAmount;
        } else {
          errors.push({
            customerId: customer.id,
            customerName: customer.name,
            error: result.error || 'Unknown error',
          });
        }
      } catch (error) {
        console.error(`Error processing billing for customer ${customer.id}:`, error);
        errors.push({
          customerId: customer.id,
          customerName: customer.name,
          error: error.message,
        });
      }
    }

    return {
      period,
      totalCustomers: customers.length,
      totalInvoices,
      totalAmount,
      results,
      errors,
    };
  }

  /**
   * Process billing for a single customer
   */
  private async processCustomerBilling(
    customer: Customer,
    from: Date,
    to: Date,
  ): Promise<CustomerBillingResult> {
    // Get unbilled transactions for the period
    const unbilledTxns = await this.unbilledTxnService.getUnbilledTxns(
      customer.id,
      from,
      to,
    );

    if (unbilledTxns.length === 0) {
      return {
        customerId: customer.id,
        customerName: customer.name,
        totalAmount: 0,
        transactionCount: 0,
        success: true,
      };
    }

    try {
      // Generate invoice
      const invoice = await this.invoiceService.generate({
        customerId: customer.id,
        periodFrom: from.toISOString(),
        periodTo: to.toISOString(),
      });

      return {
        customerId: customer.id,
        customerName: customer.name,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        transactionCount: unbilledTxns.length,
        success: true,
      };
    } catch (error) {
      return {
        customerId: customer.id,
        customerName: customer.name,
        totalAmount: 0,
        transactionCount: unbilledTxns.length,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get billing summary for a period
   */
  async getBillingSummary(period: string): Promise<{
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
  }> {
    const [year, month] = period.split('-').map(Number);
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);

    // Get all unbilled transactions for the period
    const unbilledTxns = await this.unbilledTxnRepo.find({
      where: {
        billed: false,
        ts: {
          $gte: from,
          $lte: to,
        } as any,
      },
      relations: ['customer'],
    });

    // Group by customer
    const customerMap = new Map<string, {
      customerId: string;
      customerName: string;
      unbilledAmount: number;
      transactionCount: number;
    }>();

    let totalUnbilledAmount = 0;
    let totalUnbilledTransactions = 0;

    for (const txn of unbilledTxns) {
      const customerId = txn.customerId;
      const customerName = (txn as any).customer?.name || 'Unknown Customer';
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          customerId,
          customerName,
          unbilledAmount: 0,
          transactionCount: 0,
        });
      }

      const customerSummary = customerMap.get(customerId)!;
      customerSummary.unbilledAmount += txn.amount || 0;
      customerSummary.transactionCount++;
      
      totalUnbilledAmount += txn.amount || 0;
      totalUnbilledTransactions++;
    }

    return {
      period,
      totalUnbilledAmount,
      totalUnbilledTransactions,
      customersWithUnbilledTxns: customerMap.size,
      customerSummaries: Array.from(customerMap.values()),
    };
  }
}
