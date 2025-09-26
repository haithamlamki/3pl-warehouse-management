import { Repository } from 'typeorm';
import { RateCard, RateCardRule } from '../../database/entities/rate-card.entity';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';
import { PricingEngineService } from './pricing-engine.service';
export declare class RateCardService {
    private readonly rateCardRepo;
    private readonly rateCardRuleRepo;
    private readonly pricingEngine;
    constructor(rateCardRepo: Repository<RateCard>, rateCardRuleRepo: Repository<RateCardRule>, pricingEngine: PricingEngineService);
    create(dto: CreateRateCardDto): Promise<RateCard>;
    findAll(customerId?: string, active?: boolean): Promise<RateCard[]>;
    findOne(id: string): Promise<RateCard>;
    update(id: string, dto: UpdateRateCardDto): Promise<RateCard>;
    addRule(id: string, dto: AddRateCardRuleDto): Promise<RateCard>;
    testPricing(id: string, serviceType: string, qty: number, uom: string): Promise<{
        rateCard: {
            id: any;
            name: any;
            currency: any;
        };
        input: {
            serviceType: string;
            qty: number;
            uom: string;
        };
        calculation: import("./pricing-engine.service").PricingResult;
    }>;
}
