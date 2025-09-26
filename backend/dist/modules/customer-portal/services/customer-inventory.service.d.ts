import { Repository } from 'typeorm';
import { Inventory } from '../../../database/entities/inventory.entity';
import { Item } from '../../../database/entities/item.entity';
import { Warehouse } from '../../../database/entities/warehouse.entity';
import { Bin } from '../../../database/entities/warehouse.entity';
export declare class CustomerInventoryService {
    private readonly inventoryRepo;
    private readonly itemRepo;
    private readonly warehouseRepo;
    private readonly binRepo;
    constructor(inventoryRepo: Repository<Inventory>, itemRepo: Repository<Item>, warehouseRepo: Repository<Warehouse>, binRepo: Repository<Bin>);
    getInventorySnapshot(customerId: string): Promise<{
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
