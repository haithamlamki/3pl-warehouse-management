import { PricingEngineService } from './pricing-engine.service';
import { RateCard, RateCardRule } from '../../../../src/database/entities/rate-card.entity';

describe('PricingEngineService', () => {
  let service: PricingEngineService;
  let rateCard: RateCard;

  beforeEach(() => {
    service = new PricingEngineService();
    rateCard = {
      id: 'rc1',
      tenantId: 't1',
      customerId: 'c1',
      name: 'Default',
      currency: 'USD',
      active: true,
      validFrom: null as any,
      validTo: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      customer: null as any,
      rules: [] as any,
    } as RateCard;
  });

  it('applies correct tier rule and minFee', async () => {
    const rules: RateCardRule[] = [
      { id: 'r1', rateCardId: 'rc1', serviceType: 'storage', uom: 'm3', tierFrom: 0, tierTo: 100, price: 1, minFee: 50, active: true, createdAt: new Date(), updatedAt: new Date(), rateCard: null as any },
      { id: 'r2', rateCardId: 'rc1', serviceType: 'storage', uom: 'm3', tierFrom: 101, tierTo: null as any, price: 0.8, minFee: 0, active: true, createdAt: new Date(), updatedAt: new Date(), rateCard: null as any },
    ];
    rateCard.rules = rules;

    const resLow = await service.calculatePrice(rateCard, 'storage', 10, 'm3');
    expect(resLow.basePrice).toBe(10); // 10 * 1
    expect(resLow.finalPrice).toBe(50); // minFee applied
    expect(resLow.calculation.minFeeApplied).toBe(true);

    const resHigh = await service.calculatePrice(rateCard, 'storage', 200, 'm3');
    expect(resHigh.basePrice).toBeCloseTo(160); // 200 * 0.8
    expect(resHigh.finalPrice).toBeCloseTo(160);
    expect(resHigh.calculation.minFeeApplied).toBe(false);
  });

  it('throws when no applicable rule is found', async () => {
    rateCard.rules = [] as any;
    await expect(service.calculatePrice(rateCard, 'storage', 1, 'm3')).rejects.toThrow('No applicable rate found');
  });

  it('delivery uses km first then falls back to kg', async () => {
    rateCard.rules = [
      { id: 'r1', rateCardId: 'rc1', serviceType: 'delivery', uom: 'kg', tierFrom: 0, tierTo: null as any, price: 2, minFee: 0, active: true, createdAt: new Date(), updatedAt: new Date(), rateCard: null as any },
    ] as any;

    const res = await service.calculateDeliveryCharges(rateCard, 10 /*km*/, 5 /*kg*/);
    // no km rule, falls back to kg: 5 * 2 = 10
    expect(res.finalPrice).toBe(10);
  });
});


