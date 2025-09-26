import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderLine, OrderStatus } from '../../../database/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CustomerOrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepo: Repository<OrderLine>,
  ) {}

  /**
   * Get orders for customer
   * @param customerId Customer ID
   * @param status Order status filter
   * @param type Order type filter
   * @returns Customer orders
   */
  async getOrders(customerId: string, status?: string, type?: string) {
    const query = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.lines', 'lines')
      .where('order.customerId = :customerId', { customerId });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (type) {
      query.andWhere('order.type = :type', { type });
    }

    return query.getMany();
  }

  /**
   * Create new order
   * @param dto Create order DTO
   * @returns Created order
   */
  async createOrder(dto: CreateOrderDto) {
    const order = this.orderRepo.create({
      tenantId: dto.tenantId,
      customerId: dto.customerId,
      type: dto.type,
      status: OrderStatus.NEW,
      notes: dto.notes,
    });

    const savedOrder = await this.orderRepo.save(order);

    // Create order lines
    const orderLines = dto.lines.map((line) =>
      this.orderLineRepo.create({
        orderId: savedOrder.id,
        itemSku: line.itemSku,
        qty: line.qty,
        lotId: line.lotId,
      }),
    );

    await this.orderLineRepo.save(orderLines);

    return this.getOrderDetails(savedOrder.id);
  }

  /**
   * Get order details
   * @param id Order ID
   * @returns Order details
   */
  async getOrderDetails(id: string) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['lines', 'lines.item', 'lines.lot'],
    });
  }
}