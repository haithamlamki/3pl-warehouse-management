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
exports.SignContractDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignContractDto {
}
exports.SignContractDto = SignContractDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Signer full name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignContractDto.prototype, "signerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Signer ID (national/company id)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignContractDto.prototype, "signerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request IP address', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignContractDto.prototype, "ip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Request user agent', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignContractDto.prototype, "userAgent", void 0);
//# sourceMappingURL=sign-contract.dto.js.map