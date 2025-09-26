import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: CreateItemDto): Promise<import("../../database/entities").Item>;
    findAll(): Promise<import("../../database/entities").Item[]>;
    findOne(id: string): Promise<import("../../database/entities").Item>;
    update(id: string, updateItemDto: UpdateItemDto): Promise<import("../../database/entities").Item>;
    remove(id: string): Promise<void>;
}
