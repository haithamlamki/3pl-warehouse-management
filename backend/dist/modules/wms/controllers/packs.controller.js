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
exports.PacksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const packs_service_1 = require("../services/packs.service");
const pack_dto_1 = require("../dto/pack.dto");
let PacksController = class PacksController {
    constructor(packsService) {
        this.packsService = packsService;
    }
    async pack(dto) {
        return this.packsService.pack(dto);
    }
};
exports.PacksController = PacksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm packing of picked items' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Pack confirmed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pack_dto_1.PackDto]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "pack", null);
exports.PacksController = PacksController = __decorate([
    (0, swagger_1.ApiTags)('wms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('packs'),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], PacksController);
//# sourceMappingURL=packs.controller.js.map