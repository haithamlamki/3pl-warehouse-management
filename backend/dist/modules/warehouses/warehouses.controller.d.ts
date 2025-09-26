import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    create(createWarehouseDto: CreateWarehouseDto): Promise<import("../../database/entities").Warehouse>;
    findAll(): Promise<import("../../database/entities").Warehouse[]>;
    findOne(id: string): Promise<import("../../database/entities").Warehouse>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<import("../../database/entities").Warehouse>;
    remove(id: string): Promise<void>;
}
