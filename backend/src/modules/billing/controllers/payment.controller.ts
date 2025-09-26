import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'Get payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved' })
  async findAll(
    @Query('invoiceId') invoiceId?: string,
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.paymentService.findAll(invoiceId, customerId, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Process refund' })
  @ApiResponse({ status: 200, description: 'Refund processed' })
  async refund(@Param('id') id: string, @Body() refundDto: any) {
    return this.paymentService.refund(id, refundDto);
  }
}
