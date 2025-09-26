import { ReportingService } from './reporting.service';
export declare class ReportingController {
    private readonly reportingService;
    constructor(reportingService: ReportingService);
    getDashboard(): Promise<{
        overview: {
            totalCustomers: number;
            totalOrders: number;
            totalInventory: number;
            totalRevenue: number;
        };
        recentActivity: {
            orders: import("../../database/entities").Order[];
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
        details: import("../../database/entities").Inventory[];
        totals: {
            totalItems: number;
            totalValue: number;
        };
    }>;
    getOrderReports(customerId?: string, status?: string, from?: string, to?: string): Promise<{
        orders: import("../../database/entities").Order[];
        metrics: {
            totalOrders: number;
            totalValue: number;
            totalItems: number;
            statusCounts: Record<string, number>;
        };
        trends: any[];
    }>;
    getFinancialReports(customerId?: string, from?: string, to?: string): Promise<{
        invoices: import("../../database/entities").Invoice[];
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
}
