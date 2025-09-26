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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_service_1 = require("../services/invoice.service");
const pdf_export_service_1 = require("../services/pdf-export.service");
const generate_invoice_dto_1 = require("../dto/generate-invoice.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let InvoiceController = class InvoiceController {
    constructor(invoiceService, pdfExportService) {
        this.invoiceService = invoiceService;
        this.pdfExportService = pdfExportService;
    }
    async findAll(customerId, status, from, to) {
        return this.invoiceService.findAll(customerId, status, from, to);
    }
    async findOne(id) {
        return this.invoiceService.findOne(id);
    }
    async generate(dto) {
        return this.invoiceService.generate(dto);
    }
    async generatePurchaseForClientInvoice(orderId) {
        return this.invoiceService.generatePurchaseForClientInvoice(orderId);
    }
    async send(id) {
        return this.invoiceService.send(id);
    }
    async generatePdf(id, res) {
        const htmlContent = await this.pdfExportService.generateInvoicePdf(id);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="invoice-${id}.html"`);
        res.send(htmlContent);
    }
    async exportCsv(body, res) {
        const csvContent = await this.pdfExportService.generateInvoicesCsv(body.invoiceIds);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="invoices.csv"');
        res.send(csvContent);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoices retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invoice by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate invoice' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Invoice generated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_invoice_dto_1.GenerateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('purchase-for-client/:orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate invoice for PURCHASE_FOR_CLIENT order upon ePOD completion' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Purchase for client invoice generated' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generatePurchaseForClientInvoice", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send invoice to customer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice sent' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    (0, roles_decorator_1.Roles)('admin', 'accountant', 'ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate invoice PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF generated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generatePdf", null);
__decorate([
    (0, common_1.Post)('export/csv'),
    (0, roles_decorator_1.Roles)('admin', 'accountant'),
    (0, swagger_1.ApiOperation)({ summary: 'Export invoices to CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV exported' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "exportCsv", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, swagger_1.ApiTags)('billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService,
        pdf_export_service_1.PdfExportService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map