"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const bull_1 = require("@nestjs/bull");
let EmailService = class EmailService {
    constructor(configService, emailQueue) {
        this.configService = configService;
        this.emailQueue = emailQueue;
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
    async sendEmail(options) {
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
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
    async queueEmail(options) {
        await this.emailQueue.add('send-email', options, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
    }
    async sendContractSignatureRequest(customerEmail, contractId, contractUrl) {
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
    async sendOrderStatusNotification(customerEmail, orderId, status) {
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
    async sendInvoiceNotification(customerEmail, invoiceId, amount, invoiceUrl) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], EmailService);
//# sourceMappingURL=email.service.js.map