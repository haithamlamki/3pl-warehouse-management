import { Repository } from 'typeorm';
import { Warehouse } from '../../database/entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesService {
    private readonly warehouseRepository;
    constructor(warehouseRepository: Repository<Warehouse>);
    create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse>;
    findAll(): Promise<Warehouse[]>;
    findOne(id: string): Promise<Warehouse>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse>;
    remove(id: string): Promise<void>;
}
