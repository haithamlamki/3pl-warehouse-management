import { Repository } from 'typeorm';
import { Order, Inventory, Item, Customer, Invoice, Payment } from '../../database/entities';
export declare class ReportingService {
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
        recentActivity: {
            orders: Order[];
            topCustomers: any[];
        };
        charts: {
            orderTrends: any[];
            revenueTrends: any[];
            inventoryLevels: any[];
        };
    }>;
    getInventoryReports(customerId?: string, warehouseId?: string, from?: string, to?: string): Promise<{
        summary: unknown[];
        details: Inventory[];
        totals: {
            totalItems: number;
            totalValue: number;
        };
    }>;
    getOrderReports(customerId?: string, status?: string, from?: string, to?: string): Promise<{
        orders: Order[];
        metrics: {
            totalOrders: number;
            totalValue: number;
            totalItems: number;
            statusCounts: Record<string, number>;
        };
        trends: any[];
    }>;
    getFinancialReports(customerId?: string, from?: string, to?: string): Promise<{
        invoices: Invoice[];
        financials: {
            totalInvoiced: number;
            totalPaid: number;
            totalOutstanding: number;
            statusCounts: Record<string, number>;
        };
        trends: any[];
    }>;
    getPerformanceKPIs(period?: string, customerId?: string): Promise<{
        period: string;
        kpis: {
            orderFulfillmentRate: number;
            inventoryTurnover: number;
            averageOrderValue: number;
            customerSatisfaction: number;
        };
        benchmarks: {
            industryAverage: {
                orderFulfillmentRate: number;
                inventoryTurnover: number;
                averageOrderValue: number;
                customerSatisfaction: number;
            };
        };
    }>;
    private getTotalRevenue;
    private getRecentOrders;
    private getTopCustomers;
    private getOrderTrends;
    private getRevenueTrends;
    private getInventoryLevels;
    private getDateRange;
    private getOrderFulfillmentRate;
    private getInventoryTurnover;
    private getAverageOrderValue;
    private getCustomerSatisfaction;
}
