import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * @class ReportsController
 * @description This controller exposes endpoints for retrieving various business reports.
 * @tags reports
 */
@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  /**
   * @constructor
   * @param {ReportsService} reportsService - Service for generating report data.
   */
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * @method getDashboard
   * @description Retrieves the main dashboard data, including key metrics and chart data.
   * @returns {Promise<object>} A promise that resolves to the dashboard data.
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get main dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully.' })
  async getDashboard() {
    return this.reportsService.getDashboard();
  }

  /**
   * @method getInventoryReports
   * @description Retrieves inventory reports with optional filters.
   * @param {string} [customerId] - Optional customer ID to filter the report.
   * @param {string} [warehouseId] - Optional warehouse ID to filter the report.
   * @param {string} [from] - Optional start date for the report.
   * @param {string} [to] - Optional end date for the report.
   * @returns {Promise<object>} A promise that resolves to the inventory report data.
   */
  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory reports' })
  @ApiResponse({ status: 200, description: 'Inventory reports retrieved successfully.' })
  async getInventoryReports(
    @Query('customerId') customerId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getInventoryReports(customerId, warehouseId, from, to);
  }

  /**
   * @method getOrderReports
   * @description Retrieves order reports with optional filters.
   * @param {string} [customerId] - Optional customer ID to filter the report.
   * @param {string} [status] - Optional order status to filter the report.
   * @param {string} [from] - Optional start date for the report.
   * @param {string} [to] - Optional end date for the report.
   * @returns {Promise<object>} A promise that resolves to the order report data.
   */
  @Get('orders')
  @ApiOperation({ summary: 'Get order reports' })
  @ApiResponse({ status: 200, description: 'Order reports retrieved successfully.' })
  async getOrderReports(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getOrderReports(customerId, status, from, to);
  }

  /**
   * @method getFinancialReports
   * @description Retrieves financial reports with optional filters.
   * @param {string} [customerId] - Optional customer ID to filter the report.
   * @param {string} [from] - Optional start date for the report.
   * @param {string} [to] - Optional end date for the report.
   * @returns {Promise<object>} A promise that resolves to the financial report data.
   */
  @Get('financial')
  @ApiOperation({ summary: 'Get financial reports' })
  @ApiResponse({ status: 200, description: 'Financial reports retrieved successfully.' })
  async getFinancialReports(
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getFinancialReports(customerId, from, to);
  }

  /**
   * @method getPerformanceKPIs
   * @description Retrieves key performance indicators (KPIs).
   * @param {string} [period] - Optional time period for the KPIs (e.g., 'month', 'quarter').
   * @param {string} [customerId] - Optional customer ID to filter the KPIs.
   * @returns {Promise<object>} A promise that resolves to the performance KPI data.
   */
  @Get('performance')
  @ApiOperation({ summary: 'Get key performance indicators (KPIs)' })
  @ApiResponse({ status: 200, description: 'Performance KPIs retrieved successfully.' })
  async getPerformanceKPIs(
    @Query('period') period?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.reportsService.getPerformanceKPIs(period, customerId);
  }
}