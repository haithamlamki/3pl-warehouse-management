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
exports.ReportingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reporting_service_1 = require("./reporting.service");
let ReportingController = class ReportingController {
    constructor(reportingService) {
        this.reportingService = reportingService;
    }
    async getDashboard() {
        return this.reportingService.getDashboard();
    }
    async getInventoryReports(customerId, warehouseId, from, to) {
        return this.reportingService.getInventoryReports(customerId, warehouseId, from, to);
    }
    async getOrderReports(customerId, status, from, to) {
        return this.reportingService.getOrderReports(customerId, status, from, to);
    }
    async getFinancialReports(customerId, from, to) {
        return this.reportingService.getFinancialReports(customerId, from, to);
    }
    async getPerformanceKPIs(period, customerId) {
        return this.reportingService.getPerformanceKPIs(period, customerId);
    }
};
exports.ReportingController = ReportingController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reporting dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory reports retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('warehouseId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getInventoryReports", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order reports retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getOrderReports", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial reports' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial reports retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getFinancialReports", null);
__decorate([
    (0, common_1.Get)('performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get performance KPIs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance KPIs retrieved' }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getPerformanceKPIs", null);
exports.ReportingController = ReportingController = __decorate([
    (0, swagger_1.ApiTags)('reporting'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reporting'),
    __metadata("design:paramtypes", [reporting_service_1.ReportingService])
], ReportingController);
//# sourceMappingURL=reporting.controller.js.map