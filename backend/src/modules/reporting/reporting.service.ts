import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class ReportingService {
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

  async getInventoryReports(
    customerId?: string,
    warehouseId?: string,
    from?: string,
    to?: string,
  ) {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.item', 'item')
      .leftJoinAndSelect('inventory.owner', 'customer')
      .leftJoinAndSelect('inventory.warehouse', 'warehouse');

    if (customerId) {
      query.andWhere('inventory.ownerId = :customerId', { customerId });
    }

    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }

    if (from && to) {
      query.andWhere('inventory.updatedAt BETWEEN :from AND :to', { from, to });
    }

    const inventories = await query.getMany();
    const itemSkus = [...new Set(inventories.map((inv) => inv.itemSku))];
    const priceMap = new Map<string, number>();

    if (itemSkus.length > 0) {
      const lastPurchasePrices = await this.orderLineRepository
        .createQueryBuilder('line')
        .leftJoin('line.order', 'order')
        .where('line.itemSku IN (:...itemSkus)', { itemSkus })
        .andWhere('order.type = :type', { type: OrderType.IN })
        .orderBy('line.createdAt', 'DESC')
        .getMany();

      for (const line of lastPurchasePrices) {
        if (!priceMap.has(line.itemSku)) {
          priceMap.set(line.itemSku, line.unitPrice);
        }
      }
    }

    const summary = inventories.reduce((acc, inv) => {
      const key = `${inv.ownerId}-${inv.warehouseId}`;
      if (!acc[key]) {
        acc[key] = {
          customer: (inv as any).owner,
          warehouse: inv.warehouse,
          totalItems: 0,
          totalValue: 0,
          items: [],
        };
      }
      acc[key].totalItems += inv.qty;
      const price = priceMap.get(inv.itemSku) || 0;
      acc[key].totalValue += inv.qty * price;
      acc[key].items.push(inv);
      return acc;
    }, {} as any);

    const totalValue = inventories.reduce((sum, inv) => {
      const price = priceMap.get(inv.itemSku) || 0;
      return sum + inv.qty * price;
    }, 0);

    return {
      summary: Object.values(summary),
      details: inventories,
      totals: {
        totalItems: inventories.reduce((sum, inv) => sum + inv.qty, 0),
        totalValue,
      },
    };
  }

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

    const metrics = orders.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        const orderValue =
          order.lines?.reduce(
            (sum, item) => sum + item.qty * (item.unitPrice || 0),
            0,
          ) || 0;
        acc.totalValue += orderValue;
        acc.totalItems +=
          order.lines?.reduce((sum, item) => sum + item.qty, 0) || 0;

        if (!acc.statusCounts[order.status]) {
          acc.statusCounts[order.status] = 0;
        }
        acc.statusCounts[order.status] += 1;

        return acc;
      },
      {
        totalOrders: 0,
        totalValue: 0,
        totalItems: 0,
        statusCounts: {} as Record<string, number>,
      },
    );

    return {
      orders,
      metrics,
      trends: await this.getOrderTrends(from, to),
    };
  }

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

    const financials = invoices.reduce(
      (acc, invoice) => {
        acc.totalInvoiced += invoice.total;
        const totalPaid = invoice.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        );
        acc.totalPaid += totalPaid;
        acc.totalOutstanding += invoice.total - totalPaid;

        if (!acc.statusCounts[invoice.status]) {
          acc.statusCounts[invoice.status] = 0;
        }
        acc.statusCounts[invoice.status] += 1;

        return acc;
      },
      {
        totalInvoiced: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        statusCounts: {} as Record<string, number>,
      },
    );

    return {
      invoices,
      financials,
      trends: await this.getRevenueTrends(from, to),
    };
  }

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

  private async getTotalRevenue(): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: 'PAID' })
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
      .leftJoin('order.lines', 'line')
      .select([
        'customer.id',
        'customer.name',
        'SUM(line.qty * line.unitPrice) as totalValue',
        'COUNT(DISTINCT order.id) as orderCount',
      ])
      .groupBy('customer.id, customer.name')
      .orderBy('totalValue', 'DESC')
      .limit(5)
      .getRawMany();
  }

  private async getOrderTrends(from?: string, to?: string) {
    return [];
  }

  private async getRevenueTrends(from?: string, to?: string) {
    return [];
  }

  private async getInventoryLevels() {
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

  private async getOrderFulfillmentRate(
    dateRange: any,
    customerId?: string,
  ) {
    return 95.5;
  }

  private async getInventoryTurnover(dateRange: any, customerId?: string) {
    return 6.2;
  }

  private async getAverageOrderValue(dateRange: any, customerId?: string) {
    return 450.75;
  }

  private async getCustomerSatisfaction(
    dateRange: any,
    customerId?: string,
  ) {
    return 4.3;
  }
}