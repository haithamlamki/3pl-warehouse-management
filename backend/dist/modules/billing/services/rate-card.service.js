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
exports.RateCardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rate_card_entity_1 = require("../../database/entities/rate-card.entity");
const pricing_engine_service_1 = require("./pricing-engine.service");
let RateCardService = class RateCardService {
    constructor(rateCardRepo, rateCardRuleRepo, pricingEngine) {
        this.rateCardRepo = rateCardRepo;
        this.rateCardRuleRepo = rateCardRuleRepo;
        this.pricingEngine = pricingEngine;
    }
    async create(dto) {
        const rateCard = this.rateCardRepo.create({
            tenantId: dto.tenantId,
            customerId: dto.customerId,
            name: dto.name,
            currency: dto.currency,
            validFrom: dto.validFrom ? new Date(dto.validFrom) : new Date(),
            validTo: dto.validTo ? new Date(dto.validTo) : null,
            active: dto.active ?? true,
        });
        const savedRateCard = await this.rateCardRepo.save(rateCard);
        if (dto.rules && dto.rules.length > 0) {
            const rules = dto.rules.map((rule) => this.rateCardRuleRepo.create({
                rateCardId: savedRateCard.id,
                serviceType: rule.serviceType,
                uom: rule.uom,
                tierFrom: rule.tierFrom,
                tierTo: rule.tierTo,
                price: rule.price,
                minFee: rule.minFee,
            }));
            await this.rateCardRuleRepo.save(rules);
        }
        return this.findOne(savedRateCard.id);
    }
    async findAll(customerId, active) {
        const query = this.rateCardRepo
            .createQueryBuilder('rateCard')
            .leftJoinAndSelect('rateCard.rules', 'rules')
            .orderBy('rateCard.createdAt', 'DESC');
        if (customerId) {
            query.andWhere('rateCard.customerId = :customerId', { customerId });
        }
        if (active !== undefined) {
            query.andWhere('rateCard.active = :active', { active });
        }
        return query.getMany();
    }
    async findOne(id) {
        const rateCard = await this.rateCardRepo.findOne({
            where: { id },
            relations: ['rules'],
        });
        if (!rateCard) {
            throw new common_1.NotFoundException('Rate card not found');
        }
        return rateCard;
    }
    async update(id, dto) {
        const rateCard = await this.findOne(id);
        Object.assign(rateCard, {
            name: dto.name,
            currency: dto.currency,
            validFrom: dto.validFrom ? new Date(dto.validFrom) : rateCard.validFrom,
            validTo: dto.validTo ? new Date(dto.validTo) : rateCard.validTo,
            active: dto.active,
        });
        await this.rateCardRepo.save(rateCard);
        return this.findOne(id);
    }
    async addRule(id, dto) {
        const rateCard = await this.findOne(id);
        const rule = this.rateCardRuleRepo.create({
            rateCardId: id,
            serviceType: dto.serviceType,
            uom: dto.uom,
            tierFrom: dto.tierFrom,
            tierTo: dto.tierTo,
            price: dto.price,
            minFee: dto.minFee,
        });
        await this.rateCardRuleRepo.save(rule);
        return this.findOne(id);
    }
    async testPricing(id, serviceType, qty, uom) {
        const rateCard = await this.findOne(id);
        const result = await this.pricingEngine.calculatePrice(rateCard, serviceType, qty, uom);
        return {
            rateCard: {
                id: rateCard.id,
                name: rateCard.name,
                currency: rateCard.currency,
            },
            input: {
                serviceType,
                qty,
                uom,
            },
            calculation: result,
        };
    }
};
exports.RateCardService = RateCardService;
exports.RateCardService = RateCardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rate_card_entity_1.RateCard)),
    __param(1, (0, typeorm_1.InjectRepository)(rate_card_entity_1.RateCardRule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        pricing_engine_service_1.PricingEngineService])
], RateCardService);
//# sourceMappingURL=rate-card.service.js.map