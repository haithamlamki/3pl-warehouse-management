import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnbilledTxn } from '../../database/entities/billing.entity';
import { Customer } from '../../database/entities/customer.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  /**
   * Get unbilled transactions
   * @param customerId Customer ID filter
   * @param from Start date filter
   * @param to End date filter
   * @returns Unbilled transactions
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
   * Get billing dashboard data
   * @returns Dashboard metrics
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
   * Get recent billing activity
   * @returns Recent transactions
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
