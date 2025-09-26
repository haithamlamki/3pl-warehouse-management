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
exports.PicksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const picks_service_1 = require("../services/picks.service");
const create_wave_dto_1 = require("../dto/create-wave.dto");
const complete_wave_dto_1 = require("../dto/complete-wave.dto");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
let PicksController = class PicksController {
    constructor(picksService) {
        this.picksService = picksService;
    }
    async createWave(dto) {
        return this.picksService.createWave(dto);
    }
    async completeWave(dto) {
        return this.picksService.completeWave(dto);
    }
    async fulfillOrder(orderId) {
        await this.picksService.fulfillOrder(orderId);
        return { orderId, status: 'OUT_FOR_DELIVERY', message: 'Order fulfilled successfully' };
    }
};
exports.PicksController = PicksController;
__decorate([
    (0, common_1.Post)('waves'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create picking wave' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wave created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wave_dto_1.CreateWaveDto]),
    __metadata("design:returntype", Promise)
], PicksController.prototype, "createWave", null);
__decorate([
    (0, common_1.Post)('waves/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete picking wave and mark orders PACKED' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Wave completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complete_wave_dto_1.CompleteWaveDto]),
    __metadata("design:returntype", Promise)
], PicksController.prototype, "completeWave", null);
__decorate([
    (0, common_1.Post)('fulfill/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Fulfill order - reduce inventory and mark OUT_FOR_DELIVERY' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order fulfilled' }),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PicksController.prototype, "fulfillOrder", null);
exports.PicksController = PicksController = __decorate([
    (0, swagger_1.ApiTags)('wms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('picks'),
    __metadata("design:paramtypes", [picks_service_1.PicksService])
], PicksController);
//# sourceMappingURL=picks.controller.js.map