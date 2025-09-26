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
exports.PdfExportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("../../database/entities/billing.entity");
const customer_entity_1 = require("../../database/entities/customer.entity");
let PdfExportService = class PdfExportService {
    constructor(invoiceRepo, customerRepo) {
        this.invoiceRepo = invoiceRepo;
        this.customerRepo = customerRepo;
    }
    async generateInvoicePdf(invoiceId) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id: invoiceId },
            relations: ['customer', 'lines'],
        });
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        const htmlContent = this.generateInvoiceHtml(invoice);
        return htmlContent;
    }
    generateInvoiceHtml(invoice) {
        const customer = invoice.customer;
        const lines = invoice.lines || [];
        return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-info {
            text-align: right;
            margin-bottom: 20px;
        }
        .customer-info {
            text-align: right;
            margin-bottom: 20px;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-details div {
            text-align: right;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
        }
        .items-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .totals {
            text-align: left;
            margin-top: 20px;
        }
        .totals table {
            width: 300px;
            margin-left: auto;
        }
        .totals td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>فاتورة ضريبية</h1>
            <h2>${invoice.invoiceNumber}</h2>
        </div>

        <div class="company-info">
            <h3>شركة إدارة المستودعات</h3>
            <p>العنوان: الرياض، المملكة العربية السعودية</p>
            <p>الهاتف: +966 11 123 4567</p>
            <p>البريد الإلكتروني: info@warehouse.com</p>
            <p>الرقم الضريبي: 123456789012345</p>
        </div>

        <div class="customer-info">
            <h3>بيانات العميل</h3>
            <p><strong>الاسم:</strong> ${customer.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${customer.billingEmail || 'غير محدد'}</p>
            <p><strong>الهاتف:</strong> ${customer.phone || 'غير محدد'}</p>
            <p><strong>الشخص المسؤول:</strong> ${customer.contactPerson || 'غير محدد'}</p>
        </div>

        <div class="invoice-details">
            <div>
                <p><strong>تاريخ الإصدار:</strong> ${new Date(invoice.issueDate).toLocaleDateString('ar-SA')}</p>
                <p><strong>تاريخ الاستحقاق:</strong> ${new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</p>
            </div>
            <div>
                <p><strong>حالة الفاتورة:</strong> ${this.getStatusText(invoice.status)}</p>
                <p><strong>الرقم الضريبي:</strong> ${customer.taxId || 'غير محدد'}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>الوصف</th>
                    <th>نوع الخدمة</th>
                    <th>الكمية</th>
                    <th>الوحدة</th>
                    <th>السعر</th>
                    <th>المجموع</th>
                </tr>
            </thead>
            <tbody>
                ${lines.map(line => `
                    <tr>
                        <td>${line.description}</td>
                        <td>${line.serviceType}</td>
                        <td>${line.qty}</td>
                        <td>${line.uom}</td>
                        <td>${line.rate.toFixed(2)} ريال</td>
                        <td>${line.amount.toFixed(2)} ريال</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <table>
                <tr>
                    <td>المجموع الفرعي:</td>
                    <td>${invoice.subtotal.toFixed(2)} ريال</td>
                </tr>
                <tr>
                    <td>ضريبة القيمة المضافة (15%):</td>
                    <td>${invoice.taxAmount.toFixed(2)} ريال</td>
                </tr>
                <tr class="total-row">
                    <td>المجموع الكلي:</td>
                    <td>${invoice.totalAmount.toFixed(2)} ريال</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>شكراً لاختياركم خدماتنا</p>
            <p>للاستفسارات، يرجى التواصل معنا على: info@warehouse.com</p>
        </div>
    </div>
</body>
</html>
    `;
    }
    getStatusText(status) {
        const statusMap = {
            'DRAFT': 'مسودة',
            'FINAL': 'نهائية',
            'SENT': 'مرسلة',
            'PAID': 'مدفوعة',
            'OVERDUE': 'متأخرة',
            'CANCELLED': 'ملغاة',
        };
        return statusMap[status] || status;
    }
    async generateInvoicesCsv(invoiceIds) {
        const invoices = await this.invoiceRepo.find({
            where: { id: { $in: invoiceIds } },
            relations: ['customer', 'lines'],
        });
        const csvHeaders = [
            'رقم الفاتورة',
            'تاريخ الإصدار',
            'تاريخ الاستحقاق',
            'اسم العميل',
            'البريد الإلكتروني',
            'الهاتف',
            'المجموع الفرعي',
            'ضريبة القيمة المضافة',
            'المجموع الكلي',
            'الحالة',
        ];
        const csvRows = invoices.map(invoice => [
            invoice.invoiceNumber,
            new Date(invoice.issueDate).toLocaleDateString('ar-SA'),
            new Date(invoice.dueDate).toLocaleDateString('ar-SA'),
            invoice.customer.name,
            invoice.customer.billingEmail || '',
            invoice.customer.phone || '',
            invoice.subtotal.toFixed(2),
            invoice.taxAmount.toFixed(2),
            invoice.totalAmount.toFixed(2),
            this.getStatusText(invoice.status),
        ]);
        const csvContent = [csvHeaders, ...csvRows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        return csvContent;
    }
};
exports.PdfExportService = PdfExportService;
exports.PdfExportService = PdfExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PdfExportService);
//# sourceMappingURL=pdf-export.service.js.map