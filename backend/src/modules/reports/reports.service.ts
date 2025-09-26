import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Inventory, Item, Customer, Invoice, Payment } from '../../database/entities';

@Injectable()
export class ReportsService {
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

    return {
      inventories,
      totals: {
        totalItems: inventories.reduce((sum, inv) => sum + inv.qty, 0),
        totalValue: inventories.reduce((sum, inv) => sum + (inv.qty * (inv.item?.unitPrice || 0)), 0),
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

    return {
      orders,
      metrics: {
        totalOrders: orders.length,
        totalValue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        totalItems: orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0),
      },
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

    return {
      invoices,
      financials: {
        totalInvoiced: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
        totalPaid: invoices.reduce((sum, invoice) => sum + invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0),
        totalOutstanding: invoices.reduce((sum, invoice) => sum + (invoice.total - invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0)), 0),
      },
    };
  }

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

  private async getTotalRevenue(): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async getOrderTrends() {
    return [];
  }

  private async getRevenueTrends() {
    return [];
  }

  private async getInventoryLevels() {
    return [];
  }
}
