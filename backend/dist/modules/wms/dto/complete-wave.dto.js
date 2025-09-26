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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteWaveDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PickLineDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order line ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PickLineDto.prototype, "orderLineId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Picked quantity' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PickLineDto.prototype, "pickedQty", void 0);
class CompleteWaveDto {
}
exports.CompleteWaveDto = CompleteWaveDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Wave ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteWaveDto.prototype, "waveId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Picked lines', type: [PickLineDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickLineDto),
    __metadata("design:type", Array)
], CompleteWaveDto.prototype, "picks", void 0);
//# sourceMappingURL=complete-wave.dto.js.map