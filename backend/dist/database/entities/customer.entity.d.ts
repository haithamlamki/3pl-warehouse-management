import { RateCard } from './rate-card.entity';
import { Order } from './order.entity';
import { Inventory } from './inventory.entity';
export declare class Customer {
    id: string;
    tenantId: string;
    name: string;
    taxId: string;
    billingEmail: string;
    status: string;
    address: any;
    phone: string;
    contactPerson: string;
    createdAt: Date;
    updatedAt: Date;
    contracts: Contract[];
    rateCards: RateCard[];
    orders: Order[];
    inventory: Inventory[];
}
export declare class Contract {
    id: string;
    tenantId: string;
    customerId: string;
    startDate: Date;
    endDate: Date;
    eSignStatus: string;
    terms: any;
    contractNumber: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
}
