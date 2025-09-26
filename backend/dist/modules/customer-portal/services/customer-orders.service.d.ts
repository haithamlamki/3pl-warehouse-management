import { Repository } from 'typeorm';
import { Order, OrderLine } from '../../../database/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
export declare class CustomerOrdersService {
    private readonly orderRepo;
    private readonly orderLineRepo;
    constructor(orderRepo: Repository<Order>, orderLineRepo: Repository<OrderLine>);
    getOrders(customerId: string, status?: string, type?: string): Promise<Order[]>;
    createOrder(dto: CreateOrderDto): Promise<Order>;
    getOrderDetails(id: string): Promise<Order>;
}
