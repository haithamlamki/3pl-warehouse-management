export declare class CreateItemDto {
    sku: string;
    name: string;
    description?: string;
    category?: string;
    brand?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    unitPrice?: number;
    tenantId: string;
    isActive?: boolean;
}
