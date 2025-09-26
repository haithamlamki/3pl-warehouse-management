import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerOrdersService } from '../services/customer-orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@ApiTags('customer-portal')
@ApiBearerAuth()
@Controller('customer-portal/orders')
export class CustomerOrdersController {
  constructor(private readonly ordersService: CustomerOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get customer orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved' })
  async getOrders(
    @Query('customerId') customerId: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.ordersService.getOrders(customerId, status, type);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({ status: 200, description: 'Order details retrieved' })
  async getOrderDetails(@Query('id') id: string) {
    return this.ordersService.getOrderDetails(id);
  }
}
