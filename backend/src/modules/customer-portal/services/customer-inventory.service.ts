import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../../../database/entities/inventory.entity';
import { Item } from '../../../database/entities/item.entity';
import { Warehouse } from '../../../database/entities/warehouse.entity';
import { Bin } from '../../../database/entities/warehouse.entity';

@Injectable()
export class CustomerInventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Bin)
    private readonly binRepo: Repository<Bin>,
  ) {}

  /**
   * Get inventory snapshot for customer
   * @param customerId Customer ID
   * @returns Inventory snapshot
   */
  async getInventorySnapshot(customerId: string) {
    const inventory = await this.inventoryRepo.find({
      where: { ownerId: customerId, ownerType: 'client' },
      relations: ['item', 'warehouse', 'bin', 'lot'],
    });

    return inventory.map((inv) => ({
      itemSku: inv.itemSku,
      itemName: inv.item?.name,
      warehouseName: inv.warehouse?.name,
      binCode: inv.bin?.code,
      lotCode: inv.lot?.lotCode,
      qty: inv.qty,
      availableQty: inv.availableQty,
      reservedQty: inv.reservedQty,
    }));
  }

  /**
   * Get inventory movements for customer
   * @param customerId Customer ID
   * @param from Start date
   * @param to End date
   * @returns Inventory movements
   */
  async getMovements(customerId: string, from?: string, to?: string) {
    // Stub: Return mock movements data
    return [
      {
        id: 'mov_1',
        itemSku: 'ITEM001',
        movementType: 'IN',
        qty: 100,
        date: new Date().toISOString(),
        reference: 'ASN_001',
      },
      {
        id: 'mov_2',
        itemSku: 'ITEM001',
        movementType: 'OUT',
        qty: 50,
        date: new Date().toISOString(),
        reference: 'ORDER_001',
      },
    ];
  }
}
