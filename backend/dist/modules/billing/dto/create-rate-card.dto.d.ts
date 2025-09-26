declare class RateCardRuleDto {
    serviceType: string;
    uom: string;
    tierFrom: number;
    tierTo?: number;
    price: number;
    minFee?: number;
}
export declare class CreateRateCardDto {
    tenantId: string;
    customerId: string;
    name: string;
    currency: string;
    validFrom?: string;
    validTo?: string;
    active?: boolean;
    rules?: RateCardRuleDto[];
}
export {};
