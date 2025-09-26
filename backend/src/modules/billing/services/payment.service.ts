import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Invoice } from '../../../database/entities/billing.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';

/**
 * @class PaymentService
 * @description This service manages all operations related to payments, including creation, retrieval, and refunds.
 */
@Injectable()
export class PaymentService {
  /**
   * @constructor
   * @param {Repository<Payment>} paymentRepo - Repository for Payment entities.
   * @param {Repository<Invoice>} invoiceRepo - Repository for Invoice entities.
   */
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  /**
   * @method findAll
   * @description Retrieves a list of payments, with optional filtering.
   * @param {string} [invoiceId] - Optional ID of the invoice to filter by.
   * @param {string} [customerId] - Optional ID of the customer to filter by.
   * @param {string} [from] - Optional start date for payments (YYYY-MM-DD).
   * @param {string} [to] - Optional end date for payments (YYYY-MM-DD).
   * @returns {Promise<Payment[]>} A promise that resolves to an array of Payment entities.
   */
  async findAll(
    invoiceId?: string,
    customerId?: string,
    from?: string,
    to?: string,
  ): Promise<Payment[]> {
    const query = this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.invoice', 'invoice')
      .orderBy('payment.paidAt', 'DESC');

    if (invoiceId) {
      query.andWhere('payment.invoiceId = :invoiceId', { invoiceId });
    }

    if (customerId) {
      query.andWhere('invoice.customerId = :customerId', { customerId });
    }

    if (from) {
      query.andWhere('payment.paidAt >= :from', { from });
    }

    if (to) {
      query.andWhere('payment.paidAt <= :to', { to });
    }

    return query.getMany();
  }

  /**
   * @method findOne
   * @description Finds a single payment by its unique ID.
   * @param {string} id - The unique identifier of the payment.
   * @returns {Promise<Payment>} A promise that resolves to the Payment entity.
   * @throws {NotFoundException} If no payment is found with the given ID.
   */
  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['invoice'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  /**
   * @method create
   * @description Creates a new payment for an invoice and updates the invoice status accordingly.
   * @param {CreatePaymentDto} dto - The data transfer object containing the details for the new payment.
   * @returns {Promise<Payment>} A promise that resolves to the newly created Payment entity.
   * @throws {NotFoundException} If the specified invoice is not found.
   * @throws {Error} If the payment amount exceeds the remaining balance of the invoice.
   */
  async create(dto: CreatePaymentDto): Promise<Payment> {
    // Verify invoice exists
    const invoice = await this.invoiceRepo.findOne({
      where: { id: dto.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Check if payment amount exceeds invoice balance
    const totalPaid = await this.getTotalPaidAmount(dto.invoiceId);
    const remainingBalance = invoice.total - totalPaid;

    if (dto.amount > remainingBalance) {
      throw new Error(
        `Payment amount (${dto.amount}) exceeds remaining balance (${remainingBalance})`,
      );
    }

    // Create payment
    const payment = this.paymentRepo.create({
      invoiceId: dto.invoiceId,
      method: dto.method,
      amount: dto.amount,
      reference: dto.reference,
      notes: dto.notes,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : new Date(),
    });

    const savedPayment = await this.paymentRepo.save(payment);

    // Update invoice status if fully paid
    const newTotalPaid = totalPaid + dto.amount;
    if (newTotalPaid >= invoice.total) {
      await this.invoiceRepo.update(dto.invoiceId, {
        status: 'PAID',
      });
    } else if (newTotalPaid > 0) {
      await this.invoiceRepo.update(dto.invoiceId, {
        status: 'PARTIAL',
      });
    }

    return this.findOne(savedPayment.id);
  }

  /**
   * @method refund
   * @description Processes a refund for a specific payment by creating a negative payment record.
   * @param {string} id - The unique identifier of the payment to be refunded.
   * @param {any} refundDto - An object containing the refund amount and reason.
   * @returns {Promise<{ message: string }>} A promise that resolves to an object with a success message.
   * @throws {Error} If the refund amount exceeds the original payment amount.
   */
  async refund(id: string, refundDto: any): Promise<{ message: string }> {
    const payment = await this.findOne(id);

    if (refundDto.amount > payment.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    // Create refund record (negative payment)
    const refund = this.paymentRepo.create({
      invoiceId: payment.invoiceId,
      method: `REFUND_${payment.method}`,
      amount: -refundDto.amount,
      reference: `REF-${payment.reference}`,
      notes: `Refund for payment ${payment.id}: ${refundDto.reason}`,
      paidAt: new Date(),
    });

    await this.paymentRepo.save(refund);

    // Update invoice status
    const totalPaid = await this.getTotalPaidAmount(payment.invoiceId);
    const invoice = await this.invoiceRepo.findOne({
      where: { id: payment.invoiceId },
    });

    if (totalPaid <= 0) {
      await this.invoiceRepo.update(payment.invoiceId, {
        status: 'OPEN',
      });
    } else if (totalPaid < invoice!.total) {
      await this.invoiceRepo.update(payment.invoiceId, {
        status: 'PARTIAL',
      });
    }

    return {
      message: `Refund of ${refundDto.amount} processed successfully`,
    };
  }

  /**
   * @method getTotalPaidAmount
   * @description Calculates the total paid amount for a given invoice.
   * @private
   * @param {string} invoiceId - The unique identifier of the invoice.
   * @returns {Promise<number>} A promise that resolves to the total paid amount.
   */
  private async getTotalPaidAmount(invoiceId: string): Promise<number> {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.invoiceId = :invoiceId', { invoiceId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * @method getPaymentSummary
   * @description Retrieves a summary of payments for a specific customer, with optional date filtering.
   * @param {string} customerId - The ID of the customer to retrieve the summary for.
   * @param {string} [from] - Optional start date for the payments (YYYY-MM-DD).
   * @param {string} [to] - Optional end date for the payments (YYYY-MM-DD).
   * @returns {Promise<object>} A promise that resolves to an object containing the payment summary and a list of recent payments.
   */
  async getPaymentSummary(
    customerId: string,
    from?: string,
    to?: string,
  ) {
    const query = this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoin('payment.invoice', 'invoice')
      .where('invoice.customerId = :customerId', { customerId });

    if (from) {
      query.andWhere('payment.paidAt >= :from', { from });
    }

    if (to) {
      query.andWhere('payment.paidAt <= :to', { to });
    }

    const payments = await query.getMany();

    const summary = payments.reduce(
      (acc, payment) => {
        acc.totalAmount += payment.amount;
        acc.totalPayments += 1;
        
        if (!acc.methods[payment.method]) {
          acc.methods[payment.method] = 0;
        }
        acc.methods[payment.method] += payment.amount;
        
        return acc;
      },
      {
        totalAmount: 0,
        totalPayments: 0,
        methods: {} as Record<string, number>,
      },
    );

    return {
      summary,
      payments: payments.slice(0, 10), // Recent 10 payments
    };
  }
}