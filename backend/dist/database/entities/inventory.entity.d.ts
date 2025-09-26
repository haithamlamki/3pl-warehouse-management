import { Customer } from './customer.entity';
import { Item, Lot } from './item.entity';
import { Warehouse, Bin } from './warehouse.entity';
export declare enum OwnerType {
    CLIENT = "client",
    COMPANY = "company"
}
export declare class Inventory {
    id: string;
    itemSku: string;
    ownerType: OwnerType;
    ownerId: string;
    warehouseId: string;
    binId: string;
    lotId: string;
    serialNo: string;
    qty: number;
    reservedQty: number;
    availableQty: number;
    createdAt: Date;
    updatedAt: Date;
    item: Item;
    owner: Customer;
    warehouse: Warehouse;
    bin: Bin;
    lot: Lot;
}
