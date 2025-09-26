import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Order,
  Inventory,
  Item,
  Customer,
  Invoice,
  Payment,
  OrderLine,
  OrderType,
} from '../../database/entities';

/**
 * @class ReportsService
 * @description This service is responsible for aggregating data from various sources to generate reports.
 */
@Injectable()
export class ReportsService {
  /**
   * @constructor
   * @param {Repository<Order>} orderRepository - Repository for Order entities.
   * @param {Repository<OrderLine>} orderLineRepository - Repository for OrderLine entities.
   * @param {Repository<Inventory>} inventoryRepository - Repository for Inventory entities.
   * @param {Repository<Item>} itemRepository - Repository for Item entities.
   * @param {Repository<Customer>} customerRepository - Repository for Customer entities.
   * @param {Repository<Invoice>} invoiceRepository - Repository for Invoice entities.
   * @param {Repository<Payment>} paymentRepository - Repository for Payment entities.
   */
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * @method getDashboard
   * @description Retrieves a summary of key metrics and data for the main dashboard.
   * @returns {Promise<object>} A promise that resolves to an object containing dashboard data.
   */
  async getDashboard() {
    const [
      totalCustomers,
      totalOrders,
      totalInventory,
      totalRevenue,
    ] = await Promise.all([
      this.customerRepository.count(),
      this.orderRepository.count(),
      this.inventoryRepository.count(),
      this.getTotalRevenue(),
    ]);

    return {
      overview: {
        totalCustomers,
        totalOrders,
        totalInventory,
        totalRevenue,
      },
      charts: {
        orderTrends: await this.getOrderTrends(),
        revenueTrends: await this.getRevenueTrends(),
        inventoryLevels: await this.getInventoryLevels(),
      },
    };
  }

  /**
   * @method getInventoryReports
   * @description Generates a report on current inventory levels, with optional filters.
   * @param {string} [customerId] - Optional ID of the customer to filter inventory by.
   * @param {string} [warehouseId] - Optional ID of the warehouse to filter inventory by.
   * @param {string} [from] - Optional start date to filter inventory records by their last update time.
   * @param {string} [to] - Optional end date to filter inventory records by their last update time.
   * @returns {Promise<object>} A promise that resolves to an object containing the inventory list and totals.
   */
  async getInventoryReports(
    customerId?: string,
    warehouseId?: string,
    from?: string,
    to?: string,
  ) {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.item', 'item')
      .leftJoinAndSelect('inventory.customer', 'customer')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse');

    if (customerId) {
      query.andWhere('inventory.customerId = :customerId', { customerId });
    }

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (from && to) {
      query.andWhere('inventory.updatedAt BETWEEN :from AND :to', { from, to });
    }

    const inventories = await query.getMany();
    const itemSkus = [...new Set(inventories.map((inv) => inv.itemSku))];
    let totalValue = 0;

    if (itemSkus.length > 0) {
      const lastPurchasePrices = await this.orderLineRepository
        .createQueryBuilder('line')
        .leftJoin('line.order', 'order')
        .where('line.itemSku IN (:...itemSkus)', { itemSkus })
        .andWhere('order.type = :type', { type: OrderType.IN })
        .orderBy('line.createdAt', 'DESC')
        .getMany();

      const priceMap = new Map<string, number>();
      for (const line of lastPurchasePrices) {
        if (!priceMap.has(line.itemSku)) {
          priceMap.set(line.itemSku, line.unitPrice);
        }
      }

      totalValue = inventories.reduce((sum, inv) => {
        const price = priceMap.get(inv.itemSku) || 0;
        return sum + inv.qty * price;
      }, 0);
    }

    return {
      inventories,
      totals: {
        totalItems: inventories.reduce((sum, inv) => sum + inv.qty, 0),
        totalValue,
      },
    };
  }

  /**
   * @method getOrderReports
   * @description Generates a report on orders, with optional filters.
   * @param {string} [customerId] - Optional ID of the customer to filter orders by.
   * @param {string} [status] - Optional status to filter orders by.
   * @param {string} [from] - Optional start date to filter orders by their creation time.
   * @param {string} [to] - Optional end date to filter orders by their creation time.
   * @returns {Promise<object>} A promise that resolves to an object containing the list of orders and calculated metrics.
   */
  async getOrderReports(
    customerId?: string,
    status?: string,
    from?: string,
    to?: string,
  ) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.lines', 'items')
      .leftJoinAndSelect('items.item', 'item');

    if (customerId) {
      query.andWhere('order.customerId = :customerId', { customerId });
    }

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (from && to) {
      query.andWhere('order.createdAt BETWEEN :from AND :to', { from, to });
    }

    const orders = await query.getMany();

    return {
      orders,
      metrics: {
        totalOrders: orders.length,
        totalValue: orders.reduce(
          (sum, order) =>
            sum +
            (order.lines?.reduce(
              (lineSum, line) => lineSum + line.qty * (line.unitPrice || 0),
              0,
            ) || 0),
          0,
        ),
        totalItems: orders.reduce(
          (sum, order) =>
            sum +
            (order.lines?.reduce((itemSum, item) => itemSum + item.qty, 0) || 0),
          0,
        ),
      },
    };
  }

  /**
   * @method getFinancialReports
   * @description Generates a report on financials based on invoices and payments.
   * @param {string} [customerId] - Optional ID of the customer to filter by.
   * @param {string} [from] - Optional start date for the report period.
   * @param {string} [to] - Optional end date for the report period.
   * @returns {Promise<object>} A promise that resolves to an object containing a list of invoices and financial summaries.
   */
  async getFinancialReports(
    customerId?: string,
    from?: string,
    to?: string,
  ) {
    const query = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.payments', 'payments');

    if (customerId) {
      query.andWhere('invoice.customerId = :customerId', { customerId });
    }

    if (from && to) {
      query.andWhere('invoice.createdAt BETWEEN :from AND :to', { from, to });
    }

    const invoices = await query.getMany();

    return {
      invoices,
      financials: {
        totalInvoiced: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
        totalPaid: invoices.reduce(
          (sum, invoice) =>
            sum +
            invoice.payments.reduce(
              (paymentSum, payment) => paymentSum + payment.amount,
              0,
            ),
          0,
        ),
        totalOutstanding: invoices.reduce(
          (sum, invoice) =>
            sum +
            (invoice.total -
              invoice.payments.reduce(
                (paymentSum, payment) => paymentSum + payment.amount,
                0,
              )),
          0,
        ),
      },
    };
  }

  /**
   * @method getPerformanceKPIs
   * @description Retrieves a set of mock performance KPIs.
   * @param {string} [period] - Optional period for the KPIs (e.g., 'month', 'quarter').
   * @param {string} [customerId] - Optional customer ID to filter KPIs.
   * @returns {Promise<object>} A promise that resolves to an object containing mock KPI data.
   */
  async getPerformanceKPIs(period?: string, customerId?: string) {
    return {
      period,
      kpis: {
        orderFulfillmentRate: 95.5,
        inventoryTurnover: 6.2,
        averageOrderValue: 450.75,
        customerSatisfaction: 4.3,
      },
    };
  }

  /**
   * @method getTotalRevenue
   * @description Calculates the total revenue from all 'PAID' invoices.
   * @private
   * @returns {Promise<number>} A promise that resolves to the total revenue.
   */
  private async getTotalRevenue(): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: 'PAID' })
      .getRawOne();
    return parseFloat(result.total) || 0;
  }

  /**
   * @method getOrderTrends
   * @description Placeholder for retrieving order trend data.
   * @private
   * @returns {Promise<any[]>} A promise that resolves to an empty array.
   */
  private async getOrderTrends() {
    return [];
  }

  /**
   * @method getRevenueTrends
   * @description Placeholder for retrieving revenue trend data.
   * @private
   * @returns {Promise<any[]>} A promise that resolves to an empty array.
   */
  private async getRevenueTrends() {
    return [];
  }

  /**
   * @method getInventoryLevels
   * @description Placeholder for retrieving inventory level trend data.
   * @private
   * @returns {Promise<any[]>} A promise that resolves to an empty array.
   */
  private async getInventoryLevels() {
    return [];
  }
}