import { Customer } from './customer.entity';
export declare class RateCard {
    id: string;
    tenantId: string;
    customerId: string;
    name: string;
    currency: string;
    active: boolean;
    validFrom: Date;
    validTo: Date;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    rules: RateCardRule[];
}
export declare class RateCardRule {
    id: string;
    rateCardId: string;
    serviceType: string;
    uom: string;
    tierFrom: number;
    tierTo: number;
    price: number;
    minFee: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    rateCard: RateCard;
}
