import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderLine, OrderStatus } from '../../database/entities/order.entity';
import { Inventory, OwnerType } from '../../database/entities/inventory.entity';
import { CreateReceiptDto } from '../dto/create-receipt.dto';
import { CreateCycleCountDto, PostCycleCountDto } from '../dto/create-cycle-count.dto';
import { UnbilledTxnService } from '../../billing/services/unbilled-txn.service';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepo: Repository<OrderLine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    private readonly unbilledTxnService: UnbilledTxnService,
  ) {}

  async postReceipt(dto: CreateReceiptDto) {
    // Get order and validate it's IN type
    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['lines', 'customer'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.type !== 'IN') {
      throw new Error('Order must be IN type for receipt');
    }

    // Process each receipt line
    for (const receiptLine of dto.lines) {
      const orderLine = order.lines.find(line => line.id === receiptLine.orderLineId);
      if (!orderLine) {
        throw new Error(`Order line ${receiptLine.orderLineId} not found`);
      }

      // Create or update inventory
      let inventory = await this.inventoryRepo.findOne({
        where: {
          itemSku: orderLine.itemSku,
          lotId: receiptLine.lotId,
          ownerType: OwnerType.CLIENT,
          ownerId: order.customerId,
          warehouseId: dto.warehouseId,
          binId: receiptLine.binId,
        },
      });

      if (inventory) {
        // Update existing inventory
        inventory.qty += receiptLine.receivedQty;
        inventory.availableQty += receiptLine.receivedQty;
      } else {
        // Create new inventory record
        inventory = this.inventoryRepo.create({
          itemSku: orderLine.itemSku,
          lotId: receiptLine.lotId,
          ownerType: OwnerType.CLIENT,
          ownerId: order.customerId,
          warehouseId: dto.warehouseId,
          binId: receiptLine.binId,
          qty: receiptLine.receivedQty,
          availableQty: receiptLine.receivedQty,
          reservedQty: 0,
        });
      }

      await this.inventoryRepo.save(inventory);

      // Create receipt transaction
      await this.unbilledTxnService.createReceiptTxn({
        customerId: order.customerId,
        orderId: order.id,
        orderLineId: orderLine.id,
        itemSku: orderLine.itemSku,
        qty: receiptLine.receivedQty,
        uom: 'PCS', // Default UOM
        warehouseId: dto.warehouseId,
        binId: receiptLine.binId,
        lotId: receiptLine.lotId,
      });
    }

    // Update order status to RECEIVED
    await this.orderRepo.update(order.id, { status: OrderStatus.RECEIVED });

    return { 
      receiptId: 'rcpt_' + Date.now(), 
      orderId: order.id,
      status: 'RECEIVED',
      linesProcessed: dto.lines.length 
    };
  }

  async startCycleCount(dto: CreateCycleCountDto) {
    // Stub: Start cycle count for a bin/item
    return { cycleCountId: 'cc_' + Date.now(), status: 'STARTED', ...dto };
  }

  async postCycleCount(dto: PostCycleCountDto) {
    // Process cycle count discrepancies
    for (const discrepancy of dto.discrepancies) {
      const inventory = await this.inventoryRepo.findOne({
        where: {
          itemSku: discrepancy.itemSku,
          binId: discrepancy.binId,
        },
      });

      if (inventory) {
        const difference = discrepancy.countedQty - discrepancy.systemQty;
        
        if (difference !== 0) {
          // Adjust inventory
          inventory.qty = discrepancy.countedQty;
          inventory.availableQty = discrepancy.countedQty;
          
          await this.inventoryRepo.save(inventory);

          // Create adjustment transaction
          await this.unbilledTxnService.createUnbilledTxn({
            customerId: inventory.ownerId,
            serviceType: 'INVENTORY_ADJUSTMENT',
            description: `تعديل مخزون ${discrepancy.itemSku} - الفرق: ${difference}`,
            qty: Math.abs(difference),
            uom: discrepancy.uom,
            warehouseId: inventory.warehouseId,
            binId: inventory.binId,
            itemSku: inventory.itemSku,
            lotId: inventory.lotId,
            metadata: { 
              operation: 'cycle_count_adjustment',
              systemQty: discrepancy.systemQty,
              countedQty: discrepancy.countedQty,
              difference,
              notes: discrepancy.notes 
            },
          });
        }
      }
    }

    return { 
      cycleCountId: dto.cycleCountId, 
      status: 'POSTED',
      discrepanciesProcessed: dto.discrepancies.length 
    };
  }
}


