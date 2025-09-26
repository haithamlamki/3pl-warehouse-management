import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceLine, UnbilledTxn } from '../../../database/entities/billing.entity';
import { Customer } from '../../../database/entities/customer.entity';
import { RateCard } from '../../../database/entities/rate-card.entity';
import { Order, OrderLine, OwnerTypeEffective } from '../../../database/entities/order.entity';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { PricingEngineService } from './pricing-engine.service';

/**
 * @class InvoiceService
 * @description This service manages all operations related to invoices, including creation, retrieval, and processing.
 */
@Injectable()
export class InvoiceService {
  /**
   * @constructor
   * @param {Repository<Invoice>} invoiceRepo - Repository for Invoice entities.
   * @param {Repository<InvoiceLine>} invoiceLineRepo - Repository for InvoiceLine entities.
   * @param {Repository<UnbilledTxn>} unbilledTxnRepo - Repository for UnbilledTxn entities.
   * @param {Repository<Customer>} customerRepo - Repository for Customer entities.
   * @param {Repository<RateCard>} rateCardRepo - Repository for RateCard entities.
   * @param {Repository<Order>} orderRepo - Repository for Order entities.
   * @param {Repository<OrderLine>} orderLineRepo - Repository for OrderLine entities.
   * @param {PricingEngineService} pricingEngine - Service for calculating prices based on rate cards.
   */
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLineRepo: Repository<InvoiceLine>,
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(RateCard)
    private readonly rateCardRepo: Repository<RateCard>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepo: Repository<OrderLine>,
    private readonly pricingEngine: PricingEngineService,
  ) {}

  /**
   * @method findAll
   * @description Retrieves a list of invoices, with optional filtering.
   * @param {string} [customerId] - Optional ID of the customer to filter by.
   * @param {string} [status] - Optional status to filter by (e.g., 'OPEN', 'PAID').
   * @param {string} [from] - Optional start date for the invoice period (YYYY-MM-DD).
   * @param {string} [to] - Optional end date for the invoice period (YYYY-MM-DD).
   * @returns {Promise<Invoice[]>} A promise that resolves to an array of Invoice entities.
   */
  async findAll(
    customerId?: string,
    status?: string,
    from?: string,
    to?: string,
  ): Promise<Invoice[]> {
    const query = this.invoiceRepo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.lines', 'lines')
      .orderBy('invoice.createdAt', 'DESC');

    if (customerId) {
      query.andWhere('invoice.customerId = :customerId', { customerId });
    }

    if (status) {
      query.andWhere('invoice.status = :status', { status });
    }

    if (from) {
      query.andWhere('invoice.periodFrom >= :from', { from });
    }

    if (to) {
      query.andWhere('invoice.periodTo <= :to', { to });
    }

    return query.getMany();
  }

  /**
   * @method findOne
   * @description Finds a single invoice by its unique ID, including its relations.
   * @param {string} id - The unique identifier of the invoice.
   * @returns {Promise<Invoice>} A promise that resolves to the Invoice entity.
   * @throws {NotFoundException} If no invoice is found with the given ID.
   */
  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['customer', 'lines', 'payments'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  /**
   * @method generate
   * @description Generates a new invoice from unbilled transactions for a customer within a specified period.
   * @param {GenerateInvoiceDto} dto - The data transfer object containing the details for invoice generation.
   * @returns {Promise<Invoice>} A promise that resolves to the newly created and finalized Invoice entity.
   * @throws {NotFoundException} If the specified customer is not found.
   * @throws {Error} If no unbilled transactions are found for the period.
   */
  async generate(dto: GenerateInvoiceDto): Promise<Invoice> {
    // Get customer
    const customer = await this.customerRepo.findOne({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Get unbilled transactions for the period
    const unbilledTxns = await this.unbilledTxnRepo
      .createQueryBuilder('txn')
      .where('txn.customerId = :customerId', { customerId: dto.customerId })
      .andWhere('txn.ts >= :from', { from: new Date(dto.periodFrom) })
      .andWhere('txn.ts <= :to', { to: new Date(dto.periodTo) })
      .andWhere('(txn.billed IS DISTINCT FROM TRUE)')
      .orderBy('txn.ts', 'ASC')
      .getMany();

    if (unbilledTxns.length === 0) {
      throw new Error('No unbilled transactions found for the specified period');
    }

    // Create invoice
    const invoice = this.invoiceRepo.create({
      tenantId: dto.tenantId,
      customerId: dto.customerId,
      periodFrom: new Date(dto.periodFrom),
      periodTo: new Date(dto.periodTo),
      currency: dto.currency || 'USD',
      status: 'OPEN',
      invoiceNumber: await this.generateInvoiceNumber(),
    });

    const savedInvoice = await this.invoiceRepo.save(invoice);

    // Load active rate card
    const rateCard = await this.rateCardRepo.findOne({
      where: { customerId: dto.customerId, active: true },
      relations: ['rules'],
    });

    // Create invoice lines from unbilled transactions with pricing
    let subtotal = 0;
    const invoiceLines: InvoiceLine[] = [];

    for (const txn of unbilledTxns) {
      const pricing = rateCard
        ? await this.pricingEngine.calculatePrice(
            rateCard,
            txn.serviceType,
            Number(txn.qty),
            txn.uom,
          )
        : { finalPrice: txn.amount ?? 0 } as any;

      const line = this.invoiceLineRepo.create({
        invoiceId: savedInvoice.id,
        description: `${txn.serviceType} - ${txn.description || 'Service'}`,
        serviceType: txn.serviceType,
        qty: txn.qty,
        uom: txn.uom,
        rate: pricing?.appliedRule?.price ?? txn.rate ?? 0,
        amount: pricing?.finalPrice ?? txn.amount ?? 0,
      });

      invoiceLines.push(line);
      subtotal += Number(line.amount) || 0;
    }

    await this.invoiceLineRepo.save(invoiceLines);

    // Calculate tax (if applicable)
    const taxRate = dto.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Update invoice with totals
    await this.invoiceRepo.update(savedInvoice.id, {
      subtotal,
      tax,
      total,
    });

    // Mark unbilled transactions as billed
    await this.unbilledTxnRepo
      .createQueryBuilder()
      .update()
      .set({ billed: true as any, invoiceId: savedInvoice.id } as any)
      .whereInIds(unbilledTxns.map((t) => t.id))
      .execute();

    return this.findOne(savedInvoice.id);
  }

  /**
   * @method send
   * @description Simulates sending an invoice to a customer. In a real application, this would integrate with an email service.
   * @param {string} id - The unique identifier of the invoice to send.
   * @returns {Promise<{ message: string }>} A promise that resolves to an object with a success message.
   */
  async send(id: string): Promise<{ message: string }> {
    const invoice = await this.findOne(id);

    // Here you would integrate with email service
    // For now, just return success message
    console.log(`Sending invoice ${invoice.invoiceNumber} to customer ${invoice.customerId}`);

    return {
      message: `Invoice ${invoice.invoiceNumber} sent successfully`,
    };
  }

  /**
   * @method generatePdf
   * @description Generates a mock PDF buffer for an invoice. In a real application, this would use a PDF generation library.
   * @param {string} id - The unique identifier of the invoice.
   * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the mock PDF data.
   */
  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await this.findOne(id);

    // Here you would integrate with PDF generation library
    // For now, return a mock PDF buffer
    const mockPdfContent = `
      Invoice: ${invoice.invoiceNumber}
      Customer: ${invoice.customer?.name}
      Period: ${invoice.periodFrom} - ${invoice.periodTo}
      Total: ${invoice.currency} ${invoice.total}
    `;

    return Buffer.from(mockPdfContent);
  }

  /**
   * @method generateInvoiceNumber
   * @description Generates a unique, sequential invoice number for the current month.
   * @private
   * @returns {Promise<string>} A promise that resolves to the generated invoice number (e.g., 'INV-202401-0001').
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Get count of invoices for this month
    const count = await this.invoiceRepo.count({
      where: {
        createdAt: {
          $gte: new Date(year, new Date().getMonth(), 1),
          $lt: new Date(year, new Date().getMonth() + 1, 1),
        } as any,
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `INV-${year}${month}-${sequence}`;
  }

  /**
   * @method generatePurchaseForClientInvoice
   * @description Generates a special invoice for a 'PURCHASE_FOR_CLIENT' type order after it has been delivered.
   * This includes both the sale of items and any associated service fees.
   * @param {string} orderId - The unique identifier of the order.
   * @returns {Promise<Invoice>} A promise that resolves to the newly created Invoice entity.
   * @throws {NotFoundException} If the order or an active rate card for the customer is not found.
   * @throws {Error} If the order is not of type 'PURCHASE_FOR_CLIENT' or has not been delivered.
   */
  async generatePurchaseForClientInvoice(orderId: string): Promise<Invoice> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'lines', 'lines.item'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.ownerTypeEffective !== OwnerTypeEffective.PURCHASE_FOR_CLIENT) {
      throw new Error('Order is not of type PURCHASE_FOR_CLIENT');
    }

    if (order.status !== 'DELIVERED') {
      throw new Error('Order must be delivered before generating invoice');
    }

    // Get customer's active rate card
    const rateCard = await this.rateCardRepo.findOne({
      where: { customerId: order.customerId, active: true },
      relations: ['rules'],
    });

    if (!rateCard) {
      throw new NotFoundException('Active rate card not found for this customer');
    }

    // Create invoice (entity requires currency; no issueDate field in entity)
    const invoice = this.invoiceRepo.create({
      customerId: order.customerId,
      invoiceNumber: `INV-${Date.now()}`,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'OPEN',
      currency: rateCard.currency || 'USD',
      subtotal: 0,
      tax: 0,
      total: 0,
    });

    const savedInvoice = await this.invoiceRepo.save(invoice);

    let subtotal = 0;
    const invoiceLines: InvoiceLine[] = [];

    // Process each order line
    for (const orderLine of order.lines) {
      // 1. Add sale line (بيع العنصر)
      if (orderLine.unitPrice && orderLine.unitPrice > 0) {
        const saleAmount = orderLine.qty * orderLine.unitPrice;
        const saleLine = this.invoiceLineRepo.create({
          invoiceId: savedInvoice.id,
          description: `بيع ${orderLine.item?.name || orderLine.itemSku}`,
          serviceType: 'SALE',
          qty: orderLine.qty,
          uom: orderLine.item?.uom || 'PCS',
          rate: orderLine.unitPrice,
          amount: saleAmount,
        });
        invoiceLines.push(saleLine);
        subtotal += saleAmount;
      }

      // 2. Add service lines (خدمات التخزين والتوصيل)
      const serviceTypes = ['STORAGE', 'PICKING', 'PACKING', 'DELIVERY'];
      
      for (const serviceType of serviceTypes) {
        try {
          const pricingResult = await this.pricingEngine.calculatePrice(
            rateCard,
            serviceType,
            orderLine.qty,
            orderLine.item?.uom || 'PCS',
          );
          
          if (pricingResult.finalPrice > 0) {
            const serviceLine = this.invoiceLineRepo.create({
              invoiceId: savedInvoice.id,
              description: `${serviceType} - ${orderLine.item?.name || orderLine.itemSku}`,
              serviceType,
              qty: orderLine.qty,
              uom: orderLine.item?.uom || 'PCS',
              rate: pricingResult.appliedRule?.price || 0,
              amount: pricingResult.finalPrice,
            });
            invoiceLines.push(serviceLine);
            subtotal += pricingResult.finalPrice;
          }
        } catch (error) {
          console.warn(`Could not calculate price for ${serviceType}: ${error.message}`);
        }
      }
    }

    await this.invoiceLineRepo.save(invoiceLines);

    // Calculate tax (assuming 15% VAT)
    const taxRate = 0.15;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Update invoice totals
    await this.invoiceRepo.update(savedInvoice.id, {
      subtotal,
      tax: taxAmount,
      total: totalAmount,
      status: 'FINAL',
    });

    return this.findOne(savedInvoice.id);
  }
}