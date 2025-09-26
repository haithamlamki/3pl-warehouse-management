import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnbilledTxn } from '../../../database/entities/billing.entity';
import { Customer } from '../../../database/entities/customer.entity';

/**
 * @class BillingService
 * @description This service handles general billing inquiries, such as retrieving unbilled transactions and dashboard data.
 */
@Injectable()
export class BillingService {
  /**
   * @constructor
   * @param {Repository<UnbilledTxn>} unbilledTxnRepo - Repository for UnbilledTxn entities.
   * @param {Repository<Customer>} customerRepo - Repository for Customer entities.
   */
  constructor(
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  /**
   * @method getUnbilledTransactions
   * @description Retrieves a list of unbilled transactions, with optional filters, grouped by customer.
   * @param {string} [customerId] - Optional ID of the customer to filter by.
   * @param {string} [from] - Optional start date for the transactions (YYYY-MM-DD).
   * @param {string} [to] - Optional end date for the transactions (YYYY-MM-DD).
   * @returns {Promise<object>} A promise that resolves to an object containing a summary and a list of customers with their unbilled transactions.
   */
  async getUnbilledTransactions(
    customerId?: string,
    from?: string,
    to?: string,
  ) {
    const query = this.unbilledTxnRepo
      .createQueryBuilder('unbilled')
      .leftJoinAndSelect('unbilled.customer', 'customer')
      .orderBy('unbilled.ts', 'DESC');

    if (customerId) {
      query.andWhere('unbilled.customerId = :customerId', { customerId });
    }

    if (from) {
      query.andWhere('unbilled.ts >= :from', { from });
    }

    if (to) {
      query.andWhere('unbilled.ts <= :to', { to });
    }

    const transactions = await query.getMany();

    // Group by customer
    const groupedByCustomer = transactions.reduce((acc, txn) => {
      const customerId = txn.customerId;
      if (!acc[customerId]) {
        acc[customerId] = {
          customer: txn.customer,
          transactions: [],
          totalAmount: 0,
        };
      }
      acc[customerId].transactions.push(txn);
      acc[customerId].totalAmount += txn.amount || 0;
      return acc;
    }, {} as any);

    return {
      summary: {
        totalCustomers: Object.keys(groupedByCustomer).length,
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0),
      },
      customers: Object.values(groupedByCustomer),
    };
  }

  /**
   * @method getBillingDashboard
   * @description Retrieves key metrics for the billing dashboard, including an overview of unbilled transactions and recent activity.
   * @returns {Promise<object>} A promise that resolves to an object containing dashboard data.
   */
  async getBillingDashboard() {
    const totalCustomers = await this.customerRepo.count();
    
    const unbilledStats = await this.unbilledTxnRepo
      .createQueryBuilder('unbilled')
      .select([
        'COUNT(*) as totalTransactions',
        'SUM(unbilled.amount) as totalAmount',
        'COUNT(DISTINCT unbilled.customerId) as totalCustomers',
      ])
      .getRawOne();

    return {
      overview: {
        totalCustomers,
        unbilledTransactions: parseInt(unbilledStats.totalTransactions) || 0,
        unbilledAmount: parseFloat(unbilledStats.totalAmount) || 0,
        customersWithUnbilled: parseInt(unbilledStats.totalCustomers) || 0,
      },
      recentActivity: await this.getRecentActivity(),
    };
  }

  /**
   * @method getRecentActivity
   * @description Retrieves the 10 most recent unbilled transactions.
   * @private
   * @returns {Promise<UnbilledTxn[]>} A promise that resolves to an array of the latest UnbilledTxn entities.
   */
  private async getRecentActivity() {
    return this.unbilledTxnRepo
      .createQueryBuilder('unbilled')
      .leftJoinAndSelect('unbilled.customer', 'customer')
      .orderBy('unbilled.ts', 'DESC')
      .limit(10)
      .getMany();
  }
}