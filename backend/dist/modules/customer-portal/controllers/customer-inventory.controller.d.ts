import { CustomerInventoryService } from '../services/customer-inventory.service';
export declare class CustomerInventoryController {
    private readonly inventoryService;
    constructor(inventoryService: CustomerInventoryService);
    getInventory(customerId: string): Promise<{
        itemSku: string;
        itemName: string;
        warehouseName: string;
        binCode: string;
        lotCode: string;
        qty: number;
        availableQty: number;
        reservedQty: number;
    }[]>;
    getMovements(customerId: string, from?: string, to?: string): Promise<{
        id: string;
        itemSku: string;
        movementType: string;
        qty: number;
        date: string;
        reference: string;
    }[]>;
}
