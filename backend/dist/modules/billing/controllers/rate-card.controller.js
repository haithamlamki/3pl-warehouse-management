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
exports.RateCardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rate_card_service_1 = require("../services/rate-card.service");
const create_rate_card_dto_1 = require("../dto/create-rate-card.dto");
const update_rate_card_dto_1 = require("../dto/update-rate-card.dto");
const add_rate_card_rule_dto_1 = require("../dto/add-rate-card-rule.dto");
let RateCardController = class RateCardController {
    constructor(rateCardService) {
        this.rateCardService = rateCardService;
    }
    async create(dto) {
        return this.rateCardService.create(dto);
    }
    async findAll(customerId, active) {
        return this.rateCardService.findAll(customerId, active);
    }
    async findOne(id) {
        return this.rateCardService.findOne(id);
    }
    async update(id, dto) {
        return this.rateCardService.update(id, dto);
    }
    async addRule(id, dto) {
        return this.rateCardService.addRule(id, dto);
    }
    async testPricing(id, serviceType, qty, uom) {
        return this.rateCardService.testPricing(id, serviceType, qty, uom);
    }
};
exports.RateCardController = RateCardController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create rate card' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rate card created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rate_card_dto_1.CreateRateCardDto]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get rate cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rate cards retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rate card by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rate card retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update rate card' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rate card updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rate_card_dto_1.UpdateRateCardDto]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Add rate card rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rule added' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_rate_card_rule_dto_1.AddRateCardRuleDto]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "addRule", null);
__decorate([
    (0, common_1.Get)(':id/test-pricing'),
    (0, swagger_1.ApiOperation)({ summary: 'Test pricing calculation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pricing calculated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('serviceType')),
    __param(2, (0, common_1.Query)('qty')),
    __param(3, (0, common_1.Query)('uom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], RateCardController.prototype, "testPricing", null);
exports.RateCardController = RateCardController = __decorate([
    (0, swagger_1.ApiTags)('billing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('rate-cards'),
    __metadata("design:paramtypes", [rate_card_service_1.RateCardService])
], RateCardController);
//# sourceMappingURL=rate-card.controller.js.map