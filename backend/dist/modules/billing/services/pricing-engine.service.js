"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingEngineService = void 0;
const common_1 = require("@nestjs/common");
let PricingEngineService = class PricingEngineService {
    async calculatePrice(rateCard, serviceType, qty, uom) {
        const applicableRule = this.findApplicableRule(rateCard.rules, serviceType, uom, qty);
        if (!applicableRule) {
            throw new Error(`No applicable rate found for service: ${serviceType}, UOM: ${uom}, Qty: ${qty}`);
        }
        const basePrice = qty * applicableRule.price;
        const minFee = applicableRule.minFee || 0;
        const finalPrice = Math.max(basePrice, minFee);
        return {
            basePrice,
            minFee,
            finalPrice,
            appliedRule: applicableRule,
            calculation: {
                qty,
                uom,
                rate: applicableRule.price,
                subtotal: basePrice,
                minFeeApplied: finalPrice > basePrice,
            },
        };
    }
    findApplicableRule(rules, serviceType, uom, qty) {
        const candidateRules = rules.filter((rule) => rule.serviceType === serviceType &&
            rule.uom === uom &&
            rule.active);
        if (candidateRules.length === 0) {
            return null;
        }
        const applicableRule = candidateRules.find((rule) => {
            const withinLowerBound = qty >= rule.tierFrom;
            const withinUpperBound = rule.tierTo === null || qty <= rule.tierTo;
            return withinLowerBound && withinUpperBound;
        });
        return applicableRule || null;
    }
    async calculateStorageCharges(rateCard, volume, days) {
        return this.calculatePrice(rateCard, 'storage', volume * days, 'm3');
    }
    async calculateHandlingCharges(rateCard, weight, serviceType) {
        return this.calculatePrice(rateCard, serviceType, weight, 'kg');
    }
    async calculateDeliveryCharges(rateCard, distance, weight) {
        try {
            return this.calculatePrice(rateCard, 'delivery', distance, 'km');
        }
        catch {
            return this.calculatePrice(rateCard, 'delivery', weight, 'kg');
        }
    }
    getAvailableServiceTypes(rateCard) {
        return [...new Set(rateCard.rules.map((rule) => rule.serviceType))];
    }
    getAvailableUOMs(rateCard, serviceType) {
        return [
            ...new Set(rateCard.rules
                .filter((rule) => rule.serviceType === serviceType)
                .map((rule) => rule.uom)),
        ];
    }
};
exports.PricingEngineService = PricingEngineService;
exports.PricingEngineService = PricingEngineService = __decorate([
    (0, common_1.Injectable)()
], PricingEngineService);
//# sourceMappingURL=pricing-engine.service.js.map