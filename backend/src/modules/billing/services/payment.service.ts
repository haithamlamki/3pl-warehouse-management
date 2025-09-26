import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Invoice } from '../../database/entities/billing.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  /**
   * Find all payments
   * @param invoiceId Invoice ID filter
   * @param customerId Customer ID filter
   * @param from Start date filter
   * @param to End date filter
   * @returns Payments
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
   * Find payment by ID
   * @param id Payment ID
   * @returns Payment
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
   * Create payment
   * @param dto Create payment DTO
   * @returns Created payment
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
   * Process refund
   * @param id Payment ID
   * @param refundDto Refund details
   * @returns Refund result
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
   * Get total paid amount for an invoice
   * @param invoiceId Invoice ID
   * @returns Total paid amount
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
   * Get payment summary for customer
   * @param customerId Customer ID
   * @param from Start date
   * @param to End date
   * @returns Payment summary
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
