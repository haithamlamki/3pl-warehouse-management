import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get reports dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory reports' })
  @ApiResponse({ status: 200, description: 'Inventory reports retrieved' })
  async getInventoryReports(
    @Query('customerId') customerId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getInventoryReports(customerId, warehouseId, from, to);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get order reports' })
  @ApiResponse({ status: 200, description: 'Order reports retrieved' })
  async getOrderReports(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getOrderReports(customerId, status, from, to);
  }

  @Get('financial')
  @ApiOperation({ summary: 'Get financial reports' })
  @ApiResponse({ status: 200, description: 'Financial reports retrieved' })
  async getFinancialReports(
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getFinancialReports(customerId, from, to);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance KPIs' })
  @ApiResponse({ status: 200, description: 'Performance KPIs retrieved' })
  async getPerformanceKPIs(
    @Query('period') period?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.reportsService.getPerformanceKPIs(period, customerId);
  }
}
