import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('unbilled')
  @ApiOperation({ summary: 'Get unbilled transactions' })
  @ApiResponse({ status: 200, description: 'Unbilled transactions retrieved' })
  async getUnbilledTransactions(
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.billingService.getUnbilledTransactions(customerId, from, to);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get billing dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getBillingDashboard() {
    return this.billingService.getBillingDashboard();
  }
}
