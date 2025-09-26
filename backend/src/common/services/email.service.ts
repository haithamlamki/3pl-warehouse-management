import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: any;
  html?: string;
  text?: string;
  attachments?: any[];
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  /**
   * Send email immediately
   * @param options Email options
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_USER'),
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Queue email for background processing
   * @param options Email options
   */
  async queueEmail(options: EmailOptions): Promise<void> {
    await this.emailQueue.add('send-email', options, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  /**
   * Send contract signature request email
   * @param customerEmail Customer email
   * @param contractId Contract ID
   * @param contractUrl Contract URL
   */
  async sendContractSignatureRequest(
    customerEmail: string,
    contractId: string,
    contractUrl: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Contract Signature Request</h2>
        <p>Dear Customer,</p>
        <p>You have a new contract that requires your signature.</p>
        <p>Please review and sign the contract by clicking the link below:</p>
        <a href="${contractUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign Contract</a>
        <p>Contract ID: ${contractId}</p>
        <p>Best regards,<br>3PL Warehouse Management Team</p>
      </div>
    `;

    await this.queueEmail({
      to: customerEmail,
      subject: 'Contract Signature Request',
      html,
    });
  }

  /**
   * Send order status notification
   * @param customerEmail Customer email
   * @param orderId Order ID
   * @param status Order status
   */
  async sendOrderStatusNotification(
    customerEmail: string,
    orderId: string,
    status: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Status Update</h2>
        <p>Dear Customer,</p>
        <p>Your order status has been updated.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p>You can track your order status in the customer portal.</p>
        <p>Best regards,<br>3PL Warehouse Management Team</p>
      </div>
    `;

    await this.queueEmail({
      to: customerEmail,
      subject: `Order Status Update - ${orderId}`,
      html,
    });
  }

  /**
   * Send invoice notification
   * @param customerEmail Customer email
   * @param invoiceId Invoice ID
   * @param amount Invoice amount
   * @param invoiceUrl Invoice URL
   */
  async sendInvoiceNotification(
    customerEmail: string,
    invoiceId: string,
    amount: number,
    invoiceUrl: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Invoice</h2>
        <p>Dear Customer,</p>
        <p>A new invoice has been generated for your account.</p>
        <p><strong>Invoice ID:</strong> ${invoiceId}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <a href="${invoiceUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invoice</a>
        <p>Best regards,<br>3PL Warehouse Management Team</p>
      </div>
    `;

    await this.queueEmail({
      to: customerEmail,
      subject: `New Invoice - ${invoiceId}`,
      html,
    });
  }
}
