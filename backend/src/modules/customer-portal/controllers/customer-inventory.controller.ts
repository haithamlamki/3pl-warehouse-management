import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerInventoryService } from '../services/customer-inventory.service';

@ApiTags('customer-portal')
@ApiBearerAuth()
@Controller('customer-portal/inventory')
export class CustomerInventoryController {
  constructor(private readonly inventoryService: CustomerInventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get customer inventory snapshot' })
  @ApiResponse({ status: 200, description: 'Inventory snapshot retrieved' })
  async getInventory(@Query('customerId') customerId: string) {
    return this.inventoryService.getInventorySnapshot(customerId);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get inventory movements' })
  @ApiResponse({ status: 200, description: 'Inventory movements retrieved' })
  async getMovements(
    @Query('customerId') customerId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.inventoryService.getMovements(customerId, from, to);
  }
}
