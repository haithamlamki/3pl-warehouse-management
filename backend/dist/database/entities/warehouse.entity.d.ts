import { Inventory } from './inventory.entity';
export declare class Warehouse {
    id: string;
    tenantId: string;
    name: string;
    address: any;
    code: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    bins: Bin[];
    inventory: Inventory[];
}
export declare class Bin {
    id: string;
    warehouseId: string;
    code: string;
    type: string;
    maxWeight: number;
    maxVolume: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    warehouse: Warehouse;
    inventory: Inventory[];
}
