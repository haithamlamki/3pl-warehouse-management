import { Inventory } from './inventory.entity';
export declare class Item {
    sku: string;
    tenantId: string;
    name: string;
    uom: string;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    weightKg: number;
    lotTracked: boolean;
    serialTracked: boolean;
    description: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    inventory: Inventory[];
    lots: Lot[];
}
export declare class Lot {
    id: string;
    itemSku: string;
    lotCode: string;
    expiryDate: Date;
    manufactureDate: Date;
    createdAt: Date;
    updatedAt: Date;
    item: Item;
    inventory: Inventory[];
}
