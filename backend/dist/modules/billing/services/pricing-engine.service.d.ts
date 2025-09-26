import { RateCard, RateCardRule } from '../../database/entities/rate-card.entity';
export interface PricingResult {
    basePrice: number;
    minFee: number;
    finalPrice: number;
    appliedRule?: RateCardRule;
    calculation: {
        qty: number;
        uom: string;
        rate: number;
        subtotal: number;
        minFeeApplied: boolean;
    };
}
export declare class PricingEngineService {
    calculatePrice(rateCard: RateCard, serviceType: string, qty: number, uom: string): Promise<PricingResult>;
    private findApplicableRule;
    calculateStorageCharges(rateCard: RateCard, volume: number, days: number): Promise<PricingResult>;
    calculateHandlingCharges(rateCard: RateCard, weight: number, serviceType: string): Promise<PricingResult>;
    calculateDeliveryCharges(rateCard: RateCard, distance: number, weight: number): Promise<PricingResult>;
    getAvailableServiceTypes(rateCard: RateCard): string[];
    getAvailableUOMs(rateCard: RateCard, serviceType: string): string[];
}
