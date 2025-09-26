import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { PdfExportService } from '../services/pdf-export.service';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

/**
 * @class InvoiceController
 * @description This controller exposes endpoints for managing invoices.
 * @tags billing
 */
@ApiTags('billing')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  /**
   * @constructor
   * @param {InvoiceService} invoiceService - Service for invoice-related business logic.
   * @param {PdfExportService} pdfExportService - Service for generating invoice exports (PDF, CSV).
   */
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly pdfExportService: PdfExportService,
  ) {}

  /**
   * @method findAll
   * @description Retrieves a list of invoices based on optional query parameters.
   * @param {string} [customerId] - Optional customer ID to filter invoices.
   * @param {string} [status] - Optional status to filter invoices (e.g., 'PAID', 'OPEN').
   * @param {string} [from] - Optional start date for the invoice period.
   * @param {string} [to] - Optional end date for the invoice period.
   * @returns {Promise<Invoice[]>} A promise that resolves to an array of invoices.
   */
  @Get()
  @ApiOperation({ summary: 'Get a list of invoices with optional filters' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully.' })
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.invoiceService.findAll(customerId, status, from, to);
  }

  /**
   * @method findOne
   * @description Retrieves a single invoice by its unique ID.
   * @param {string} id - The unique identifier of the invoice.
   * @returns {Promise<Invoice>} A promise that resolves to the requested invoice.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single invoice by its ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  /**
   * @method generate
   * @description Generates a new invoice from unbilled transactions.
   * @param {GenerateInvoiceDto} dto - The data needed to generate the invoice.
   * @returns {Promise<Invoice>} A promise that resolves to the newly generated invoice.
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate a new invoice from unbilled transactions' })
  @ApiResponse({ status: 201, description: 'Invoice generated successfully.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  async generate(@Body() dto: GenerateInvoiceDto) {
    return this.invoiceService.generate(dto);
  }

  /**
   * @method generatePurchaseForClientInvoice
   * @description Generates a special invoice for a 'PURCHASE_FOR_CLIENT' order after it has been delivered.
   * @param {string} orderId - The unique identifier of the delivered order.
   * @returns {Promise<Invoice>} A promise that resolves to the newly generated invoice.
   */
  @Post('purchase-for-client/:orderId')
  @ApiOperation({ summary: 'Generate an invoice for a PURCHASE_FOR_CLIENT order' })
  @ApiResponse({ status: 201, description: 'Invoice for purchase-for-client order generated successfully.' })
  @ApiResponse({ status: 404, description: 'Order or rate card not found.' })
  async generatePurchaseForClientInvoice(@Param('orderId') orderId: string) {
    return this.invoiceService.generatePurchaseForClientInvoice(orderId);
  }

  /**
   * @method send
   * @description Simulates sending an invoice to a customer.
   * @param {string} id - The unique identifier of the invoice to send.
   * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
   */
  @Post(':id/send')
  @ApiOperation({ summary: 'Send an invoice to the customer' })
  @ApiResponse({ status: 200, description: 'Invoice sent successfully.' })
  async send(@Param('id') id: string) {
    return this.invoiceService.send(id);
  }

  /**
   * @method generatePdf
   * @description Generates and returns an HTML representation of an invoice, suitable for PDF conversion.
   * @param {string} id - The unique identifier of the invoice.
   * @param {Response} res - The Express response object to send the HTML to.
   */
  @Get(':id/pdf')
  @Roles('admin', 'accountant', 'ops')
  @ApiOperation({ summary: 'Generate an HTML/PDF representation of an invoice' })
  @ApiResponse({ status: 200, description: 'Invoice HTML generated successfully.' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const htmlContent = await this.pdfExportService.generateInvoicePdf(id);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${id}.html"`);
    res.send(htmlContent);
  }

  /**
   * @method exportCsv
   * @description Exports a list of specified invoices to a CSV file.
   * @param {object} body - The request body containing the invoice IDs.
   * @param {string[]} body.invoiceIds - An array of invoice IDs to export.
   * @param {Response} res - The Express response object to send the CSV file to.
   */
  @Post('export/csv')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Export a list of invoices to a CSV file' })
  @ApiResponse({ status: 200, description: 'CSV file generated and sent successfully.' })
  async exportCsv(@Body() body: { invoiceIds: string[] }, @Res() res: Response) {
    const csvContent = await this.pdfExportService.generateInvoicesCsv(body.invoiceIds);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="invoices.csv"');
    res.send(csvContent);
  }
}