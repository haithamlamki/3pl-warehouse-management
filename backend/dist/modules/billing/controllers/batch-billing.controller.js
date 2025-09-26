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
exports.BatchBillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const batch_billing_service_1 = require("../services/batch-billing.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let BatchBillingController = class BatchBillingController {
    constructor(batchBillingService) {
        this.batchBillingService = batchBillingService;
    }
    async runMonthlyBilling(period) {
        if (!/^\d{4}-\d{2}$/.test(period)) {
            throw new Error('Period must be in YYYY-MM format');
        }
        return this.batchBillingService.runMonthlyBilling(period);
    }
    async getBillingSummary(period) {
        if (!/^\d{4}-\d{2}$/.test(period)) {
            throw new Error('Period must be in YYYY-MM format');
        }
        return this.batchBillingService.getBillingSummary(period);
    }
};
exports.BatchBillingController = BatchBillingController;
__decorate([
    (0, common_1.Post)('run-cycle'),
    (0, roles_decorator_1.Roles)('admin', 'accountant'),
    (0, swagger_1.ApiOperation)({ summary: 'Run monthly billing cycle for all customers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing cycle completed' }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        description: 'Billing period in YYYY-MM format',
        example: '2024-01',
        required: true
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchBillingController.prototype, "runMonthlyBilling", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)('admin', 'accountant'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing summary for a period' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Billing summary retrieved' }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        description: 'Billing period in YYYY-MM format',
        example: '2024-01',
        required: true
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchBillingController.prototype, "getBillingSummary", null);
exports.BatchBillingController = BatchBillingController = __decorate([
    (0, swagger_1.ApiTags)('billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('billing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [batch_billing_service_1.BatchBillingService])
], BatchBillingController);
//# sourceMappingURL=batch-billing.controller.js.map