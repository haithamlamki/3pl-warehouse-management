import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerShipmentsService } from '../services/customer-shipments.service';

@ApiTags('customer-portal')
@ApiBearerAuth()
@Controller('customer-portal/shipments')
export class CustomerShipmentsController {
  constructor(private readonly shipmentsService: CustomerShipmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get customer shipments' })
  @ApiResponse({ status: 200, description: 'Shipments retrieved' })
  async getShipments(
    @Query('customerId') customerId: string,
    @Query('status') status?: string,
  ) {
    return this.shipmentsService.getShipments(customerId, status);
  }

  @Get('tracking/:trackingNumber')
  @ApiOperation({ summary: 'Track shipment' })
  @ApiResponse({ status: 200, description: 'Tracking information retrieved' })
  async trackShipment(@Query('trackingNumber') trackingNumber: string) {
    return this.shipmentsService.trackShipment(trackingNumber);
  }
}
