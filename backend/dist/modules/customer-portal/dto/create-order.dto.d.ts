export declare enum OrderType {
    IN = "IN",
    OUT = "OUT",
    TRANSFER = "TRANSFER"
}
declare class OrderLineDto {
    itemSku: string;
    qty: number;
    lotId?: string;
}
export declare class CreateOrderDto {
    tenantId: string;
    customerId: string;
    type: OrderType;
    lines: OrderLineDto[];
    notes?: string;
}
export {};
