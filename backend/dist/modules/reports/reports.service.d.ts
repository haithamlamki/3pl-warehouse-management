import { Repository } from 'typeorm';
import { Order, Inventory, Item, Customer, Invoice, Payment } from '../../database/entities';
export declare class ReportsService {
    private readonly orderRepository;
    private readonly inventoryRepository;
    private readonly itemRepository;
    private readonly customerRepository;
    private readonly invoiceRepository;
    private readonly paymentRepository;
    constructor(orderRepository: Repository<Order>, inventoryRepository: Repository<Inventory>, itemRepository: Repository<Item>, customerRepository: Repository<Customer>, invoiceRepository: Repository<Invoice>, paymentRepository: Repository<Payment>);
    getDashboard(): Promise<{
        overview: {
            totalCustomers: number;
            totalOrders: number;
            totalInventory: number;
            totalRevenue: number;
        };
        charts: {
            orderTrends: any[];
            revenueTrends: any[];
            inventoryLevels: any[];
        };
    }>;
    getInventoryReports(customerId?: string, warehouseId?: string, from?: string, to?: string): Promise<{
        inventories: Inventory[];
        totals: {
            totalItems: number;
            totalValue: number;
        };
    }>;
    getOrderReports(customerId?: string, status?: string, from?: string, to?: string): Promise<{
        orders: Order[];
        metrics: {
            totalOrders: number;
            totalValue: any;
            totalItems: any;
        };
    }>;
    getFinancialReports(customerId?: string, from?: string, to?: string): Promise<{
        invoices: Invoice[];
        financials: {
            totalInvoiced: number;
            totalPaid: number;
            totalOutstanding: number;
        };
    }>;
    getPerformanceKPIs(period?: string, customerId?: string): Promise<{
        period: string;
        kpis: {
            orderFulfillmentRate: number;
            inventoryTurnover: number;
            averageOrderValue: number;
            customerSatisfaction: number;
        };
    }>;
    private getTotalRevenue;
    private getOrderTrends;
    private getRevenueTrends;
    private getInventoryLevels;
}
