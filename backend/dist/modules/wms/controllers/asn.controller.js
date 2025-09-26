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
exports.AsnController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asn_service_1 = require("../services/asn.service");
const create_asn_dto_1 = require("../dto/create-asn.dto");
let AsnController = class AsnController {
    constructor(asnService) {
        this.asnService = asnService;
    }
    async create(dto) {
        return this.asnService.create(dto);
    }
};
exports.AsnController = AsnController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create ASN (advance shipment notice)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'ASN created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asn_dto_1.CreateAsnDto]),
    __metadata("design:returntype", Promise)
], AsnController.prototype, "create", null);
exports.AsnController = AsnController = __decorate([
    (0, swagger_1.ApiTags)('wms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('asn'),
    __metadata("design:paramtypes", [asn_service_1.AsnService])
], AsnController);
//# sourceMappingURL=asn.controller.js.map