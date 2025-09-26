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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../database/entities/customer.entity");
let ContractsService = class ContractsService {
    constructor(contractRepo) {
        this.contractRepo = contractRepo;
    }
    async create(dto) {
        const contract = this.contractRepo.create({
            tenantId: dto.tenantId,
            customerId: dto.customerId,
            startDate: dto.startDate,
            endDate: dto.endDate ?? null,
            eSignStatus: 'draft',
            terms: dto.terms ?? {},
            contractNumber: dto.contractNumber ?? null,
        });
        return this.contractRepo.save(contract);
    }
    async sign(id, dto) {
        const contract = await this.contractRepo.findOne({ where: { id } });
        if (!contract) {
            throw new common_1.NotFoundException('Contract not found');
        }
        const updatedTerms = {
            ...(contract.terms ?? {}),
            eSign: {
                signerName: dto.signerName,
                signerId: dto.signerId ?? null,
                signedAt: new Date().toISOString(),
                ip: dto.ip ?? null,
                userAgent: dto.userAgent ?? null,
            },
        };
        contract.eSignStatus = 'signed';
        contract.terms = updatedTerms;
        return this.contractRepo.save(contract);
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map