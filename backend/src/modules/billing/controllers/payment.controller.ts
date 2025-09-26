import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

/**
 * @class PaymentController
 * @description This controller exposes endpoints for managing payments.
 * @tags billing
 */
@ApiTags('billing')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  /**
   * @constructor
   * @param {PaymentService} paymentService - Service for payment-related business logic.
   */
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * @method findAll
   * @description Retrieves a list of payments based on optional query parameters.
   * @param {string} [invoiceId] - Optional invoice ID to filter payments.
   * @param {string} [customerId] - Optional customer ID to filter payments.
   * @param {string} [from] - Optional start date for payments.
   * @param {string} [to] - Optional end date for payments.
   * @returns {Promise<Payment[]>} A promise that resolves to an array of payments.
   */
  @Get()
  @ApiOperation({ summary: 'Get a list of payments with optional filters' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully.' })
  async findAll(
    @Query('invoiceId') invoiceId?: string,
    @Query('customerId') customerId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.paymentService.findAll(invoiceId, customerId, from, to);
  }

  /**
   * @method findOne
   * @description Retrieves a single payment by its unique ID.
   * @param {string} id - The unique identifier of the payment.
   * @returns {Promise<Payment>} A promise that resolves to the requested payment.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single payment by its ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  /**
   * @method create
   * @description Creates a new payment for an invoice.
   * @param {CreatePaymentDto} dto - The data needed to create the payment.
   * @returns {Promise<Payment>} A promise that resolves to the newly created payment.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new payment for an invoice' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  @ApiResponse({ status: 400, description: 'Payment amount exceeds remaining balance.' })
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  /**
   * @method refund
   * @description Processes a refund for a specific payment.
   * @param {string} id - The unique identifier of the payment to refund.
   * @param {object} refundDto - The data for the refund, including amount and reason.
   * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
   */
  @Post(':id/refund')
  @ApiOperation({ summary: 'Process a refund for a payment' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully.' })
  @ApiResponse({ status: 400, description: 'Refund amount exceeds payment amount.' })
  async refund(@Param('id') id: string, @Body() refundDto: any) {
    return this.paymentService.refund(id, refundDto);
  }
}