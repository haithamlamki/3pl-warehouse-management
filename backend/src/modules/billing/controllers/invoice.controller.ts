import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { PdfExportService } from '../services/pdf-export.service';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly pdfExportService: PdfExportService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved' })
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.invoiceService.findAll(customerId, status, from, to);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved' })
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate invoice' })
  @ApiResponse({ status: 201, description: 'Invoice generated' })
  async generate(@Body() dto: GenerateInvoiceDto) {
    return this.invoiceService.generate(dto);
  }

  @Post('purchase-for-client/:orderId')
  @ApiOperation({ summary: 'Generate invoice for PURCHASE_FOR_CLIENT order upon ePOD completion' })
  @ApiResponse({ status: 201, description: 'Purchase for client invoice generated' })
  async generatePurchaseForClientInvoice(@Param('orderId') orderId: string) {
    return this.invoiceService.generatePurchaseForClientInvoice(orderId);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send invoice to customer' })
  @ApiResponse({ status: 200, description: 'Invoice sent' })
  async send(@Param('id') id: string) {
    return this.invoiceService.send(id);
  }

  @Get(':id/pdf')
  @Roles('admin', 'accountant', 'ops')
  @ApiOperation({ summary: 'Generate invoice PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const htmlContent = await this.pdfExportService.generateInvoicePdf(id);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${id}.html"`);
    res.send(htmlContent);
  }

  @Post('export/csv')
  @Roles('admin', 'accountant')
  @ApiOperation({ summary: 'Export invoices to CSV' })
  @ApiResponse({ status: 200, description: 'CSV exported' })
  async exportCsv(@Body() body: { invoiceIds: string[] }, @Res() res: Response) {
    const csvContent = await this.pdfExportService.generateInvoicesCsv(body.invoiceIds);
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="invoices.csv"');
    res.send(csvContent);
  }
}
