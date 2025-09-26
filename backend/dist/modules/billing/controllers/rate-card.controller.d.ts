import { RateCardService } from '../services/rate-card.service';
import { CreateRateCardDto } from '../dto/create-rate-card.dto';
import { UpdateRateCardDto } from '../dto/update-rate-card.dto';
import { AddRateCardRuleDto } from '../dto/add-rate-card-rule.dto';
export declare class RateCardController {
    private readonly rateCardService;
    constructor(rateCardService: RateCardService);
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
        calculation: import("../services/pricing-engine.service").PricingResult;
    }>;
}
