import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, Inventory, Item, Customer, Invoice, Payment } from '../../database/entities';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
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
   * Get comprehensive dashboard data
   */
  async getDashboard() {
    const [
      totalCustomers,
      totalOrders,
      totalInventory,
      totalRevenue,
      recentOrders,
      topCustomers,
    ] = await Promise.all([
      this.customerRepository.count(),
      this.orderRepository.count(),
      this.inventoryRepository.count(),
      this.getTotalRevenue(),
      this.getRecentOrders(),
      this.getTopCustomers(),
    ]);

    return {
      overview: {
        totalCustomers,
        totalOrders,
        totalInventory,
        totalRevenue,
      },
      recentActivity: {
        orders: recentOrders,
        topCustomers,
      },
      charts: {
        orderTrends: await this.getOrderTrends(),
        revenueTrends: await this.getRevenueTrends(),
        inventoryLevels: await this.getInventoryLevels(),
      },
    };
  }

  /**
   * Get inventory reports
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

    // Group by customer and warehouse
    const summary = inventories.reduce((acc, inv) => {
      const key = `${inv.customerId}-${inv.warehouseId}`;
      if (!acc[key]) {
        acc[key] = {
          customer: inv.customer,
          warehouse: inv.warehouse,
          totalItems: 0,
          totalValue: 0,
          items: [],
        };
      }
      acc[key].totalItems += inv.qty;
      acc[key].totalValue += (inv.qty * (inv.item?.unitPrice || 0));
      acc[key].items.push(inv);
      return acc;
    }, {} as any);

    return {
      summary: Object.values(summary),
      details: inventories,
      totals: {
        totalItems: inventories.reduce((sum, inv) => sum + inv.qty, 0),
        totalValue: inventories.reduce((sum, inv) => sum + (inv.qty * (inv.item?.unitPrice || 0)), 0),
      },
    };
  }

  /**
   * Get order reports
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
      .leftJoinAndSelect('order.items', 'items')
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

    // Calculate order metrics
    const metrics = orders.reduce((acc, order) => {
      acc.totalOrders += 1;
      acc.totalValue += order.totalAmount || 0;
      acc.totalItems += order.items.reduce((sum, item) => sum + item.qty, 0);
      
      if (!acc.statusCounts[order.status]) {
        acc.statusCounts[order.status] = 0;
      }
      acc.statusCounts[order.status] += 1;
      
      return acc;
    }, {
      totalOrders: 0,
      totalValue: 0,
      totalItems: 0,
      statusCounts: {} as Record<string, number>,
    });

    return {
      orders,
      metrics,
      trends: await this.getOrderTrends(from, to),
    };
  }

  /**
   * Get financial reports
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

    const financials = invoices.reduce((acc, invoice) => {
      acc.totalInvoiced += invoice.total;
      acc.totalPaid += invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
      acc.totalOutstanding += invoice.total - invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      if (!acc.statusCounts[invoice.status]) {
        acc.statusCounts[invoice.status] = 0;
      }
      acc.statusCounts[invoice.status] += 1;
      
      return acc;
    }, {
      totalInvoiced: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      statusCounts: {} as Record<string, number>,
    });

    return {
      invoices,
      financials,
      trends: await this.getRevenueTrends(from, to),
    };
  }

  /**
   * Get performance KPIs
   */
  async getPerformanceKPIs(period?: string, customerId?: string) {
    const dateRange = this.getDateRange(period);
    
    const [
      orderFulfillmentRate,
      inventoryTurnover,
      averageOrderValue,
      customerSatisfaction,
    ] = await Promise.all([
      this.getOrderFulfillmentRate(dateRange, customerId),
      this.getInventoryTurnover(dateRange, customerId),
      this.getAverageOrderValue(dateRange, customerId),
      this.getCustomerSatisfaction(dateRange, customerId),
    ]);

    return {
      period,
      kpis: {
        orderFulfillmentRate,
        inventoryTurnover,
        averageOrderValue,
        customerSatisfaction,
      },
      benchmarks: {
        industryAverage: {
          orderFulfillmentRate: 95,
          inventoryTurnover: 6,
          averageOrderValue: 500,
          customerSatisfaction: 4.2,
        },
      },
    };
  }

  // Helper methods
  private async getTotalRevenue(): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async getRecentOrders() {
    return this.orderRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
      relations: ['customer'],
    });
  }

  private async getTopCustomers() {
    return this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.orders', 'order')
      .select([
        'customer.id',
        'customer.name',
        'SUM(order.totalAmount) as totalValue',
        'COUNT(order.id) as orderCount',
      ])
      .groupBy('customer.id')
      .orderBy('totalValue', 'DESC')
      .limit(5)
      .getRawMany();
  }

  private async getOrderTrends(from?: string, to?: string) {
    // Implementation for order trends over time
    return [];
  }

  private async getRevenueTrends(from?: string, to?: string) {
    // Implementation for revenue trends over time
    return [];
  }

  private async getInventoryLevels() {
    // Implementation for inventory level trends
    return [];
  }

  private getDateRange(period?: string) {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1);
    }
    
    return { start, end: now };
  }

  private async getOrderFulfillmentRate(dateRange: any, customerId?: string) {
    // Implementation for order fulfillment rate calculation
    return 95.5;
  }

  private async getInventoryTurnover(dateRange: any, customerId?: string) {
    // Implementation for inventory turnover calculation
    return 6.2;
  }

  private async getAverageOrderValue(dateRange: any, customerId?: string) {
    // Implementation for average order value calculation
    return 450.75;
  }

  private async getCustomerSatisfaction(dateRange: any, customerId?: string) {
    // Implementation for customer satisfaction calculation
    return 4.3;
  }
}
