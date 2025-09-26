import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnbilledTxn } from '../../database/entities/billing.entity';
import { RateCard } from '../../database/entities/rate-card.entity';
import { PricingEngineService } from './pricing-engine.service';

export interface CreateUnbilledTxnDto {
  customerId: string;
  serviceType: string;
  description: string;
  qty: number;
  uom: string;
  orderId?: string;
  orderLineId?: string;
  warehouseId?: string;
  binId?: string;
  itemSku?: string;
  lotId?: string;
  metadata?: any;
}

@Injectable()
export class UnbilledTxnService {
  constructor(
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    @InjectRepository(RateCard)
    private readonly rateCardRepo: Repository<RateCard>,
    private readonly pricingEngine: PricingEngineService,
  ) {}

  /**
   * Create unbilled transaction with automatic pricing
   */
  async createUnbilledTxn(dto: CreateUnbilledTxnDto): Promise<UnbilledTxn> {
    // Get customer's active rate card
    const rateCard = await this.rateCardRepo.findOne({
      where: { customerId: dto.customerId, active: true },
      relations: ['rules'],
    });

    let rate = 0;
    let amount = 0;

    if (rateCard) {
      try {
        const pricingResult = await this.pricingEngine.calculatePrice(
          rateCard,
          dto.serviceType,
          dto.qty,
          dto.uom,
        );
        rate = pricingResult.appliedRule?.price || 0;
        amount = pricingResult.finalPrice;
      } catch (error) {
        console.warn(`Could not calculate price for ${dto.serviceType}: ${error.message}`);
        // Continue with rate = 0, amount = 0
      }
    }

    const unbilledTxn = this.unbilledTxnRepo.create({
      customerId: dto.customerId,
      serviceType: dto.serviceType,
      description: dto.description,
      qty: dto.qty,
      uom: dto.uom,
      rate,
      amount,
      orderId: dto.orderId,
      orderLineId: dto.orderLineId,
      warehouseId: dto.warehouseId,
      binId: dto.binId,
      itemSku: dto.itemSku,
      lotId: dto.lotId,
      metadata: dto.metadata,
      ts: new Date(),
      billed: false,
    });

    return this.unbilledTxnRepo.save(unbilledTxn);
  }

  /**
   * Create unbilled transaction for receipt operations
   */
  async createReceiptTxn(dto: {
    customerId: string;
    orderId: string;
    orderLineId: string;
    itemSku: string;
    qty: number;
    uom: string;
    warehouseId: string;
    binId?: string;
    lotId?: string;
  }): Promise<UnbilledTxn> {
    return this.createUnbilledTxn({
      customerId: dto.customerId,
      serviceType: 'RECEIPT',
      description: `استلام ${dto.itemSku}`,
      qty: dto.qty,
      uom: dto.uom,
      orderId: dto.orderId,
      orderLineId: dto.orderLineId,
      warehouseId: dto.warehouseId,
      binId: dto.binId,
      itemSku: dto.itemSku,
      lotId: dto.lotId,
      metadata: { operation: 'receipt' },
    });
  }

  /**
   * Create unbilled transaction for picking operations
   */
  async createPickingTxn(dto: {
    customerId: string;
    orderId: string;
    orderLineId: string;
    itemSku: string;
    qty: number;
    uom: string;
    warehouseId: string;
    binId?: string;
    lotId?: string;
  }): Promise<UnbilledTxn> {
    return this.createUnbilledTxn({
      customerId: dto.customerId,
      serviceType: 'PICKING',
      description: `انتقاء ${dto.itemSku}`,
      qty: dto.qty,
      uom: dto.uom,
      orderId: dto.orderId,
      orderLineId: dto.orderLineId,
      warehouseId: dto.warehouseId,
      binId: dto.binId,
      itemSku: dto.itemSku,
      lotId: dto.lotId,
      metadata: { operation: 'picking' },
    });
  }

  /**
   * Create unbilled transaction for packing operations
   */
  async createPackingTxn(dto: {
    customerId: string;
    orderId: string;
    orderLineId: string;
    itemSku: string;
    qty: number;
    uom: string;
    warehouseId: string;
    binId?: string;
    lotId?: string;
  }): Promise<UnbilledTxn> {
    return this.createUnbilledTxn({
      customerId: dto.customerId,
      serviceType: 'PACKING',
      description: `تعبئة ${dto.itemSku}`,
      qty: dto.qty,
      uom: dto.uom,
      orderId: dto.orderId,
      orderLineId: dto.orderLineId,
      warehouseId: dto.warehouseId,
      binId: dto.binId,
      itemSku: dto.itemSku,
      lotId: dto.lotId,
      metadata: { operation: 'packing' },
    });
  }

  /**
   * Create unbilled transaction for storage operations
   */
  async createStorageTxn(dto: {
    customerId: string;
    itemSku: string;
    qty: number;
    uom: string;
    warehouseId: string;
    binId?: string;
    lotId?: string;
    storageDays?: number;
  }): Promise<UnbilledTxn> {
    return this.createUnbilledTxn({
      customerId: dto.customerId,
      serviceType: 'STORAGE',
      description: `تخزين ${dto.itemSku}${dto.storageDays ? ` (${dto.storageDays} يوم)` : ''}`,
      qty: dto.qty,
      uom: dto.uom,
      warehouseId: dto.warehouseId,
      binId: dto.binId,
      itemSku: dto.itemSku,
      lotId: dto.lotId,
      metadata: { operation: 'storage', storageDays: dto.storageDays },
    });
  }

  /**
   * Create unbilled transaction for delivery operations
   */
  async createDeliveryTxn(dto: {
    customerId: string;
    orderId: string;
    itemSku: string;
    qty: number;
    uom: string;
    warehouseId: string;
    deliveryAddress?: string;
    distance?: number;
  }): Promise<UnbilledTxn> {
    return this.createUnbilledTxn({
      customerId: dto.customerId,
      serviceType: 'DELIVERY',
      description: `توصيل ${dto.itemSku}${dto.deliveryAddress ? ` إلى ${dto.deliveryAddress}` : ''}`,
      qty: dto.qty,
      uom: dto.uom,
      orderId: dto.orderId,
      warehouseId: dto.warehouseId,
      itemSku: dto.itemSku,
      metadata: { operation: 'delivery', deliveryAddress: dto.deliveryAddress, distance: dto.distance },
    });
  }

  /**
   * Get unbilled transactions for a customer in a period
   */
  async getUnbilledTxns(
    customerId: string,
    from: Date,
    to: Date,
  ): Promise<UnbilledTxn[]> {
    return this.unbilledTxnRepo.find({
      where: {
        customerId,
        billed: false,
        ts: {
          $gte: from,
          $lte: to,
        } as any,
      },
      order: { ts: 'ASC' },
    });
  }

  /**
   * Mark transactions as billed
   */
  async markAsBilled(transactionIds: string[], invoiceId: string): Promise<void> {
    await this.unbilledTxnRepo.update(
      { id: { $in: transactionIds } } as any,
      { billed: true, invoiceId },
    );
  }
}
