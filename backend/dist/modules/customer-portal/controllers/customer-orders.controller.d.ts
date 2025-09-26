import { CustomerOrdersService } from '../services/customer-orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
export declare class CustomerOrdersController {
    private readonly ordersService;
    constructor(ordersService: CustomerOrdersService);
    getOrders(customerId: string, status?: string, type?: string): Promise<import("../../../database/entities").Order[]>;
    createOrder(dto: CreateOrderDto): Promise<import("../../../database/entities").Order>;
    getOrderDetails(id: string): Promise<import("../../../database/entities").Order>;
}
