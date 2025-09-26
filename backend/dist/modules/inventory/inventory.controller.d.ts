import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto): Promise<import("../../database/entities").Inventory>;
    findAll(): Promise<import("../../database/entities").Inventory[]>;
    findOne(id: string): Promise<import("../../database/entities").Inventory>;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<import("../../database/entities").Inventory>;
    remove(id: string): Promise<void>;
}
