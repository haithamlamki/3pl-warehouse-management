import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../../database/entities/customer.entity';
import { UnbilledTxn } from '../../../database/entities/billing.entity';
import { InvoiceService } from './invoice.service';
import { UnbilledTxnService } from './unbilled-txn.service';

/**
 * @interface BatchBillingResult
 * @description Represents the overall result of a batch billing run.
 */
export interface BatchBillingResult {
  /** @member {string} period - The billing period in YYYY-MM format. */
  period: string;
  /** @member {number} totalCustomers - The total number of customers processed. */
  totalCustomers: number;
  /** @member {number} totalInvoices - The total number of invoices successfully generated. */
  totalInvoices: number;
  /** @member {number} totalAmount - The total monetary amount of all generated invoices. */
  totalAmount: number;
  /** @member {CustomerBillingResult[]} results - An array of detailed results for each customer. */
  results: CustomerBillingResult[];
  /** @member {BillingError[]} errors - An array of errors that occurred during the billing run. */
  errors: BillingError[];
}

/**
 * @interface CustomerBillingResult
 * @description Represents the billing result for a single customer.
 */
export interface CustomerBillingResult {
  /** @member {string} customerId - The unique identifier for the customer. */
  customerId: string;
  /** @member {string} customerName - The name of the customer. */
  customerName: string;
  /** @member {string} [invoiceId] - The ID of the generated invoice, if successful. */
  invoiceId?: string;
  /** @member {string} [invoiceNumber] - The number of the generated invoice, if successful. */
  invoiceNumber?: string;
  /** @member {number} totalAmount - The total amount of the invoice for this customer. */
  totalAmount: number;
  /** @member {number} transactionCount - The number of unbilled transactions processed for this customer. */
  transactionCount: number;
  /** @member {boolean} success - A flag indicating whether the billing was successful for this customer. */
  success: boolean;
  /** @member {string} [error] - The error message, if billing failed for this customer. */
  error?: string;
}

/**
 * @interface BillingError
 * @description Represents an error that occurred for a specific customer during the batch billing process.
 */
export interface BillingError {
  /** @member {string} customerId - The unique identifier for the customer who had an error. */
  customerId: string;
  /** @member {string} customerName - The name of the customer. */
  customerName: string;
  /** @member {string} error - The error message. */
  error: string;
}

/**
 * @class BatchBillingService
 * @description This service handles batch processing of billing cycles for multiple customers.
 */
@Injectable()
export class BatchBillingService {
  /**
   * @constructor
   * @param {Repository<Customer>} customerRepo - Repository for Customer entities.
   * @param {Repository<UnbilledTxn>} unbilledTxnRepo - Repository for UnbilledTxn entities.
   * @param {InvoiceService} invoiceService - Service for generating individual invoices.
   * @param {UnbilledTxnService} unbilledTxnService - Service for handling unbilled transactions.
   */
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    private readonly invoiceService: InvoiceService,
    private readonly unbilledTxnService: UnbilledTxnService,
  ) {}

  /**
   * @method runMonthlyBilling
   * @description Executes the monthly billing cycle for all active customers for a specified period.
   * @param {string} period - The billing period in YYYY-MM format.
   * @returns {Promise<BatchBillingResult>} A promise that resolves to a summary of the batch billing run.
   */
  async runMonthlyBilling(period: string): Promise<BatchBillingResult> {
    const [year, month] = period.split('-').map(Number);
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59, 999);

    console.log(`Running monthly billing for period ${period} (${from.toISOString()} to ${to.toISOString()})`);

    const customers = await this.customerRepo.find({
      where: { status: 'active' as any },
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
   * @method processCustomerBilling
   * @description Processes all unbilled transactions for a single customer and generates an invoice.
   * @private
   * @param {Customer} customer - The customer entity to process billing for.
   * @param {Date} from - The start date of the billing period.
   * @param {Date} to - The end date of the billing period.
   * @returns {Promise<CustomerBillingResult>} A promise that resolves to the billing result for the customer.
   */
  private async processCustomerBilling(
    customer: Customer,
    from: Date,
    to: Date,
  ): Promise<CustomerBillingResult> {
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
      const invoice = await this.invoiceService.generate({
        tenantId: customer.tenantId,
        customerId: customer.id,
        periodFrom: from.toISOString(),
        periodTo: to.toISOString(),
      });

      return {
        customerId: customer.id,
        customerName: customer.name,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.total,
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
   * @method getBillingSummary
   * @description Retrieves a summary of all unbilled transactions for a given period, grouped by customer.
   * @param {string} period - The billing period in YYYY-MM format.
   * @returns {Promise<object>} A promise that resolves to an object containing the billing summary.
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