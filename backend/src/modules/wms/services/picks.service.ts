import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderLine, OrderStatus } from '../../database/entities/order.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { CreateWaveDto } from '../dto/create-wave.dto';
import { CompleteWaveDto } from '../dto/complete-wave.dto';
import { UnbilledTxnService } from '../../billing/services/unbilled-txn.service';

@Injectable()
export class PicksService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepo: Repository<OrderLine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly unbilledTxnService: UnbilledTxnService,
  ) {}

  async createWave(dto: CreateWaveDto) {
    // Get orders and validate they are in APPROVED status
    const orders = await this.orderRepo.find({
      where: { 
        id: { $in: dto.orderIds } as any,
        status: OrderStatus.APPROVED,
        type: 'OUT'
      },
      relations: ['lines', 'customer'],
    });

    if (orders.length !== dto.orderIds.length) {
      throw new Error('Some orders are not in APPROVED status or not OUT type');
    }

    // Create picking wave
    const waveId = 'wave_' + Date.now();
    
    // Update orders to PICKING status
    await this.orderRepo.update(
      { id: { $in: dto.orderIds } } as any,
      { status: OrderStatus.PICKING }
    );

    return { 
      waveId, 
      orders: dto.orderIds, 
      status: 'CREATED',
      orderCount: orders.length 
    };
  }

  async completeWave(dto: CompleteWaveDto) {
    // Get orders in the wave
    const orders = await this.orderRepo.find({
      where: { id: { $in: dto.packedOrderIds } } as any,
      relations: ['lines', 'customer'],
    });

    for (const order of orders) {
      // Update order status to PACKED
      await this.orderRepo.update(order.id, { status: OrderStatus.PACKED });

      // Process each order line for picking billing
      for (const orderLine of order.lines) {
        // Create picking transaction
        await this.unbilledTxnService.createPickingTxn({
          customerId: order.customerId,
          orderId: order.id,
          orderLineId: orderLine.id,
          itemSku: orderLine.itemSku,
          qty: orderLine.pickedQty || orderLine.qty,
          uom: 'PCS', // Default UOM
          warehouseId: 'default-warehouse', // TODO: Get from order context
          binId: orderLine.lotId, // Using lotId as binId for now
          lotId: orderLine.lotId,
        });

        // Create packing transaction
        await this.unbilledTxnService.createPackingTxn({
          customerId: order.customerId,
          orderId: order.id,
          orderLineId: orderLine.id,
          itemSku: orderLine.itemSku,
          qty: orderLine.packedQty || orderLine.qty,
          uom: 'PCS', // Default UOM
          warehouseId: 'default-warehouse', // TODO: Get from order context
          binId: orderLine.lotId, // Using lotId as binId for now
          lotId: orderLine.lotId,
        });
      }
    }

    return { 
      waveId: dto.waveId, 
      status: 'COMPLETED', 
      packedOrders: dto.packedOrderIds,
      orderCount: orders.length 
    };
  }

  /**
   * Fulfill order - reduce inventory after picking
   */
  async fulfillOrder(orderId: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['lines'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== OrderStatus.PACKED) {
      throw new Error('Order must be in PACKED status to fulfill');
    }

    for (const orderLine of order.lines) {
      // Find inventory to reduce
      const inventory = await this.inventoryRepo.findOne({
        where: {
          itemSku: orderLine.itemSku,
          lotId: orderLine.lotId,
          ownerType: 'client', // Assuming client ownership
          ownerId: order.customerId,
        },
      });

      if (inventory) {
        const fulfillQty = orderLine.packedQty || orderLine.qty;
        
        if (inventory.availableQty < fulfillQty) {
          throw new Error(`Insufficient inventory for ${orderLine.itemSku}. Available: ${inventory.availableQty}, Required: ${fulfillQty}`);
        }

        // Reduce inventory
        inventory.availableQty -= fulfillQty;
        inventory.qty -= fulfillQty;
        
        await this.inventoryRepo.save(inventory);
      }
    }

    // Update order status to OUT_FOR_DELIVERY
    await this.orderRepo.update(orderId, { status: OrderStatus.OUT_FOR_DELIVERY });
  }
}


