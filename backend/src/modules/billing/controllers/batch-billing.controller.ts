import { Controller, Post, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BatchBillingService } from '../services/batch-billing.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

/**
 * @class BatchBillingController
 * @description This controller exposes endpoints for running and managing batch billing processes.
 * @tags billing
 */
@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchBillingController {
  /**
   * @constructor
   * @param {BatchBillingService} batchBillingService - Service for handling batch billing logic.
   */
  constructor(private readonly batchBillingService: BatchBillingService) {}

  /**
   * @method runMonthlyBilling
   * @description Triggers the billing cycle for all active customers for a specified month.
   * @param {string} period - The billing period in YYYY-MM format.
   * @returns {Promise<BatchBillingResult>} A promise that resolves to the results of the batch billing run.
   * @throws {BadRequestException} If the period format is invalid.
   */
  @Post('run-cycle')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Run monthly billing cycle for all customers' })
  @ApiResponse({ status: 200, description: 'Billing cycle completed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid period format.' })
  @ApiQuery({ 
    name: 'period', 
    description: 'Billing period in YYYY-MM format', 
    example: '2024-01',
    required: true 
  })
  async runMonthlyBilling(@Query('period') period: string) {
    // Validate period format
    if (!/^\d{4}-\d{2}$/.test(period)) {
      throw new BadRequestException('Period must be in YYYY-MM format');
    }

    return this.batchBillingService.runMonthlyBilling(period);
  }

  /**
   * @method getBillingSummary
   * @description Retrieves a summary of unbilled transactions for a specified period.
   * @param {string} period - The billing period in YYYY-MM format.
   * @returns {Promise<object>} A promise that resolves to the billing summary.
   * @throws {BadRequestException} If the period format is invalid.
   */
  @Get('summary')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Get billing summary for a period' })
  @ApiResponse({ status: 200, description: 'Billing summary retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid period format.' })
  @ApiQuery({ 
    name: 'period', 
    description: 'Billing period in YYYY-MM format', 
    example: '2024-01',
    required: true 
  })
  async getBillingSummary(@Query('period') period: string) {
    // Validate period format
    if (!/^\d{4}-\d{2}$/.test(period)) {
      throw new BadRequestException('Period must be in YYYY-MM format');
    }

    return this.batchBillingService.getBillingSummary(period);
  }
}