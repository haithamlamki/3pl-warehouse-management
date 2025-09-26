import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Item, Lot } from './item.entity';
export declare enum OrderType {
    IN = "IN",
    OUT = "OUT",
    TRANSFER = "TRANSFER"
}
export declare enum OrderStatus {
    NEW = "NEW",
    APPROVED = "APPROVED",
    PICKING = "PICKING",
    PACKED = "PACKED",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
    RECEIVED = "RECEIVED",
    CLOSED = "CLOSED",
    ON_HOLD = "ON_HOLD"
}
export declare enum OwnerTypeEffective {
    CONSIGNMENT = "CONSIGNMENT",
    PURCHASE_FOR_CLIENT = "PURCHASE_FOR_CLIENT",
    COMPANY_OWNED = "COMPANY_OWNED"
}
export declare class Order {
    id: string;
    tenantId: string;
    customerId: string;
    type: OrderType;
    status: OrderStatus;
    slaTs: Date;
    notes: string;
    createdBy: string;
    ownerTypeEffective: OwnerTypeEffective;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    creator: User;
    lines: OrderLine[];
}
export declare class OrderLine {
    id: string;
    orderId: string;
    itemSku: string;
    lotId: string;
    qty: number;
    pickedQty: number;
    packedQty: number;
    ownerTypeEffective: OwnerTypeEffective;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
    order: Order;
    item: Item;
    lot: Lot;
}
