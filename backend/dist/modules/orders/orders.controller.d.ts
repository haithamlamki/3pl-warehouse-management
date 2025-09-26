import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("../../database/entities").Order>;
    findAll(): Promise<import("../../database/entities").Order[]>;
    findOne(id: string): Promise<import("../../database/entities").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("../../database/entities").Order>;
    remove(id: string): Promise<void>;
}
