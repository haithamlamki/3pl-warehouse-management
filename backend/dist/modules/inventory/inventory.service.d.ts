import { Repository } from 'typeorm';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryRepository;
    constructor(inventoryRepository: Repository<Inventory>);
    create(createInventoryDto: CreateInventoryDto): Promise<Inventory>;
    findAll(): Promise<Inventory[]>;
    findOne(id: string): Promise<Inventory>;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory>;
    remove(id: string): Promise<void>;
}
