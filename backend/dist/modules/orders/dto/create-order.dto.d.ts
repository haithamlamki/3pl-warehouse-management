declare class OrderItemDto {
    itemId: string;
    qty: number;
    unitPrice?: number;
}
export declare class CreateOrderDto {
    customerId: string;
    orderNumber: string;
    description?: string;
    requiredDate?: string;
    priority?: string;
    items: OrderItemDto[];
    tenantId: string;
}
export {};
