import { Injectable } from '@nestjs/common';
import { RateCard, RateCardRule } from '../../../database/entities/rate-card.entity';

/**
 * @interface PricingResult
 * @description Represents the detailed result of a pricing calculation.
 */
export interface PricingResult {
  /** @member {number} basePrice - The price calculated before any minimum fees are applied (qty * rate). */
  basePrice: number;
  /** @member {number} minFee - The minimum fee for the service, if applicable. */
  minFee: number;
  /** @member {number} finalPrice - The final price after applying the minimum fee (the greater of basePrice and minFee). */
  finalPrice: number;
  /** @member {RateCardRule} [appliedRule] - The specific rate card rule that was used for the calculation. */
  appliedRule?: RateCardRule;
  /** @member {object} calculation - A detailed breakdown of how the price was calculated. */
  calculation: {
    /** @member {number} qty - The quantity used in the calculation. */
    qty: number;
    /** @member {string} uom - The unit of measure used. */
    uom: string;
    /** @member {number} rate - The rate applied from the rate card rule. */
    rate: number;
    /** @member {number} subtotal - The subtotal before the minimum fee is considered. */
    subtotal: number;
    /** @member {boolean} minFeeApplied - A flag indicating if the minimum fee was applied. */
    minFeeApplied: boolean;
  };
}

/**
 * @class PricingEngineService
 * @description Handles all logic related to calculating prices based on rate card rules.
 */
@Injectable()
export class PricingEngineService {
  /**
   * @method calculatePrice
   * @description Calculates the final price for a given service, quantity, and unit of measure based on the rules in a rate card.
   * @param {RateCard} rateCard - The rate card containing the pricing rules.
   * @param {string} serviceType - The type of service being priced (e.g., 'STORAGE', 'PICKING').
   * @param {number} qty - The quantity of the service.
   * @param {string} uom - The unit of measure for the quantity.
   * @returns {Promise<PricingResult>} A promise that resolves to a detailed pricing result.
   * @throws {Error} If no applicable rate is found for the given parameters.
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
   * @method findApplicableRule
   * @description Finds the most specific, active rule from a list that matches the given service type, UOM, and quantity tier.
   * @private
   * @param {RateCardRule[]} rules - An array of rate card rules to search through.
   * @param {string} serviceType - The service type to match.
   * @param {string} uom - The unit of measure to match.
   * @param {number} qty - The quantity to check against the rule's tier.
   * @returns {RateCardRule | null} The applicable rule if found, otherwise null.
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
   * @method calculateStorageCharges
   * @description Calculates storage charges for a given volume and duration.
   * @param {RateCard} rateCard - The rate card to use for pricing.
   * @param {number} volume - The volume of the stored items in cubic meters.
   * @param {number} days - The number of days the items were stored.
   * @returns {Promise<PricingResult>} A promise that resolves to the calculated storage charges.
   */
  async calculateStorageCharges(
    rateCard: RateCard,
    volume: number,
    days: number,
  ): Promise<PricingResult> {
    return this.calculatePrice(rateCard, 'storage', volume * days, 'm3');
  }

  /**
   * @method calculateHandlingCharges
   * @description Calculates handling charges based on weight for a specific service type.
   * @param {RateCard} rateCard - The rate card to use for pricing.
   * @param {number} weight - The weight of the items in kilograms.
   * @param {string} serviceType - The type of handling service (e.g., 'receipt', 'picking').
   * @returns {Promise<PricingResult>} A promise that resolves to the calculated handling charges.
   */
  async calculateHandlingCharges(
    rateCard: RateCard,
    weight: number,
    serviceType: string,
  ): Promise<PricingResult> {
    return this.calculatePrice(rateCard, serviceType, weight, 'kg');
  }

  /**
   * @method calculateDeliveryCharges
   * @description Calculates delivery charges, attempting to price by distance first, then falling back to weight.
   * @param {RateCard} rateCard - The rate card to use for pricing.
   * @param {number} distance - The delivery distance in kilometers.
   * @param {number} weight - The weight of the delivery in kilograms.
   * @returns {Promise<PricingResult>} A promise that resolves to the calculated delivery charges.
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
   * @method getAvailableServiceTypes
   * @description Extracts a list of unique, available service types from a rate card.
   * @param {RateCard} rateCard - The rate card to analyze.
   * @returns {string[]} An array of unique service type strings.
   */
  getAvailableServiceTypes(rateCard: RateCard): string[] {
    return [...new Set((rateCard.rules || []).map((rule: RateCardRule) => rule.serviceType as string))] as string[];
  }

  /**
   * @method getAvailableUOMs
   * @description Extracts a list of unique, available units of measure for a specific service type from a rate card.
   * @param {RateCard} rateCard - The rate card to analyze.
   * @param {string} serviceType - The service type to filter by.
   * @returns {string[]} An array of unique UOM strings for the given service type.
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