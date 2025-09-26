import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
        inventories: import("../../database/entities").Inventory[];
        totals: {
            totalItems: number;
            totalValue: number;
        };
    }>;
    getOrderReports(customerId?: string, status?: string, from?: string, to?: string): Promise<{
        orders: import("../../database/entities").Order[];
        metrics: {
            totalOrders: number;
            totalValue: any;
            totalItems: any;
        };
    }>;
    getFinancialReports(customerId?: string, from?: string, to?: string): Promise<{
        invoices: import("../../database/entities").Invoice[];
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
}
