import { Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { BatchBillingService } from '../services/batch-billing.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchBillingController {
  constructor(private readonly batchBillingService: BatchBillingService) {}

  @Post('run-cycle')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Run monthly billing cycle for all customers' })
  @ApiResponse({ status: 200, description: 'Billing cycle completed' })
  @ApiQuery({ 
    name: 'period', 
    description: 'Billing period in YYYY-MM format', 
    example: '2024-01',
    required: true 
  })
  async runMonthlyBilling(@Query('period') period: string) {
    // Validate period format
    if (!/^\d{4}-\d{2}$/.test(period)) {
      throw new Error('Period must be in YYYY-MM format');
    }

    return this.batchBillingService.runMonthlyBilling(period);
  }

  @Get('summary')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Get billing summary for a period' })
  @ApiResponse({ status: 200, description: 'Billing summary retrieved' })
  @ApiQuery({ 
    name: 'period', 
    description: 'Billing period in YYYY-MM format', 
    example: '2024-01',
    required: true 
  })
  async getBillingSummary(@Query('period') period: string) {
    // Validate period format
    if (!/^\d{4}-\d{2}$/.test(period)) {
      throw new Error('Period must be in YYYY-MM format');
    }

    return this.batchBillingService.getBillingSummary(period);
  }
}
