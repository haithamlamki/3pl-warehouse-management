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
exports.ReceiptsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const receipts_service_1 = require("../services/receipts.service");
const create_receipt_dto_1 = require("../dto/create-receipt.dto");
const create_cycle_count_dto_1 = require("../dto/create-cycle-count.dto");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
let ReceiptsController = class ReceiptsController {
    constructor(receiptsService) {
        this.receiptsService = receiptsService;
    }
    async postReceipt(dto) {
        return this.receiptsService.postReceipt(dto);
    }
    async startCycleCount(dto) {
        return this.receiptsService.startCycleCount(dto);
    }
    async postCycleCount(dto) {
        return this.receiptsService.postCycleCount(dto);
    }
};
exports.ReceiptsController = ReceiptsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Post a receipt against ASN or PO' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Receipt posted' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_receipt_dto_1.CreateReceiptDto]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "postReceipt", null);
__decorate([
    (0, common_1.Post)('cycle-count/start'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Start cycle count for a bin/item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cycle count started' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cycle_count_dto_1.CreateCycleCountDto]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "startCycleCount", null);
__decorate([
    (0, common_1.Post)('cycle-count/post'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops'),
    (0, swagger_1.ApiOperation)({ summary: 'Post cycle count differences and adjust inventory' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cycle count posted' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cycle_count_dto_1.CreateCycleCountDto]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "postCycleCount", null);
exports.ReceiptsController = ReceiptsController = __decorate([
    (0, swagger_1.ApiTags)('wms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('receipts'),
    __metadata("design:paramtypes", [receipts_service_1.ReceiptsService])
], ReceiptsController);
//# sourceMappingURL=receipts.controller.js.map