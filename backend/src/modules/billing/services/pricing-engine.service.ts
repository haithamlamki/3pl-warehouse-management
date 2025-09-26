import { Injectable } from '@nestjs/common';
import { RateCard, RateCardRule } from '../../../database/entities/rate-card.entity';

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

@Injectable()
export class PricingEngineService {
  /**
   * Calculate price based on rate card rules
   * @param rateCard Rate card
   * @param serviceType Service type
   * @param qty Quantity
   * @param uom Unit of measure
   * @returns Pricing calculation result
   */
  async calculatePrice(
    rateCard: RateCard,
    serviceType: string,
    qty: number,
    uom: string,
  ): Promise<PricingResult> {
    // Find applicable rule
    const applicableRule = this.findApplicableRule(
      rateCard.rules,
      serviceType,
      uom,
      qty,
    );

    if (!applicableRule) {
      throw new Error(
        `No applicable rate found for service: ${serviceType}, UOM: ${uom}, Qty: ${qty}`,
      );
    }

    // Calculate base price
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

  /**
   * Find applicable rule for given parameters
   * @param rules Rate card rules
   * @param serviceType Service type
   * @param uom Unit of measure
   * @param qty Quantity
   * @returns Applicable rule or null
   */
  private findApplicableRule(
    rules: RateCardRule[],
    serviceType: string,
    uom: string,
    qty: number,
  ): RateCardRule | null {
    // Filter rules by service type and UOM
    const candidateRules = rules.filter(
      (rule) =>
        rule.serviceType === serviceType &&
        rule.uom === uom &&
        rule.active,
    );

    if (candidateRules.length === 0) {
      return null;
    }

    // Find rule that matches quantity tier
    const applicableRule = candidateRules.find((rule) => {
      const withinLowerBound = qty >= rule.tierFrom;
      const withinUpperBound = rule.tierTo === null || qty <= rule.tierTo;
      return withinLowerBound && withinUpperBound;
    });

    return applicableRule || null;
  }

  /**
   * Calculate storage charges for a period
   * @param rateCard Rate card
   * @param volume Volume in cubic meters
   * @param days Number of days
   * @returns Storage charges
   */
  async calculateStorageCharges(
    rateCard: RateCard,
    volume: number,
    days: number,
  ): Promise<PricingResult> {
    return this.calculatePrice(rateCard, 'storage', volume * days, 'm3');
  }

  /**
   * Calculate handling charges
   * @param rateCard Rate card
   * @param weight Weight in kg
   * @param serviceType Service type (receipt, picking, etc.)
   * @returns Handling charges
   */
  async calculateHandlingCharges(
    rateCard: RateCard,
    weight: number,
    serviceType: string,
  ): Promise<PricingResult> {
    return this.calculatePrice(rateCard, serviceType, weight, 'kg');
  }

  /**
   * Calculate delivery charges
   * @param rateCard Rate card
   * @param distance Distance in km
   * @param weight Weight in kg
   * @returns Delivery charges
   */
  async calculateDeliveryCharges(
    rateCard: RateCard,
    distance: number,
    weight: number,
  ): Promise<PricingResult> {
    // Use distance-based pricing if available, otherwise weight-based
    try {
      return await this.calculatePrice(rateCard, 'delivery', distance, 'km');
    } catch {
      return await this.calculatePrice(rateCard, 'delivery', weight, 'kg');
    }
  }

  /**
   * Get all available service types from rate card
   * @param rateCard Rate card
   * @returns Service types
   */
  getAvailableServiceTypes(rateCard: RateCard): string[] {
    return [...new Set((rateCard.rules || []).map((rule: RateCardRule) => rule.serviceType as string))] as string[];
  }

  /**
   * Get all available UOMs for a service type
   * @param rateCard Rate card
   * @param serviceType Service type
   * @returns UOMs
   */
  getAvailableUOMs(rateCard: RateCard, serviceType: string): string[] {
    return [
      ...new Set(
        (rateCard.rules || [])
          .filter((rule: RateCardRule) => rule.serviceType === serviceType)
          .map((rule: RateCardRule) => rule.uom as string),
      ),
    ] as string[];
  }
}
