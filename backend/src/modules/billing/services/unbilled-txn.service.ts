import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UnbilledTxn } from '../../../database/entities/billing.entity';
import { RateCard } from '../../../database/entities/rate-card.entity';
import { PricingEngineService } from './pricing-engine.service';

/**
 * @interface CreateUnbilledTxnDto
 * @description Data transfer object for creating a new unbilled transaction.
 */
export interface CreateUnbilledTxnDto {
  /** @member {string} customerId - The ID of the customer associated with the transaction. */
  customerId: string;
  /** @member {string} serviceType - The type of service provided (e.g., 'STORAGE', 'PICKING'). */
  serviceType: string;
  /** @member {string} description - A description of the transaction. */
  description: string;
  /** @member {number} qty - The quantity of the service provided. */
  qty: number;
  /** @member {string} uom - The unit of measure for the quantity. */
  uom: string;
  /** @member {string} [orderId] - The optional ID of the related order. */
  orderId?: string;
  /** @member {string} [orderLineId] - The optional ID of the related order line. */
  orderLineId?: string;
  /** @member {string} [warehouseId] - The optional ID of the warehouse where the service occurred. */
  warehouseId?: string;
  /** @member {string} [binId] - The optional ID of the bin where the service occurred. */
  binId?: string;
  /** @member {string} [itemSku] - The optional SKU of the item involved. */
  itemSku?: string;
  /** @member {string} [lotId] - The optional ID of the lot involved. */
  lotId?: string;
  /** @member {any} [metadata] - Optional metadata associated with the transaction. */
  metadata?: any;
}

/**
 * @class UnbilledTxnService
 * @description This service manages the creation and retrieval of unbilled transactions, which represent billable events that have not yet been invoiced.
 */
@Injectable()
export class UnbilledTxnService {
  /**
   * @constructor
   * @param {Repository<UnbilledTxn>} unbilledTxnRepo - Repository for UnbilledTxn entities.
   * @param {Repository<RateCard>} rateCardRepo - Repository for RateCard entities.
   * @param {PricingEngineService} pricingEngine - Service for calculating prices.
   */
  constructor(
    @InjectRepository(UnbilledTxn)
    private readonly unbilledTxnRepo: Repository<UnbilledTxn>,
    @InjectRepository(RateCard)
    private readonly rateCardRepo: Repository<RateCard>,
    private readonly pricingEngine: PricingEngineService,
  ) {}

  /**
   * @method createUnbilledTxn
   * @description Creates a new unbilled transaction and automatically calculates its price using the customer's active rate card.
   * @param {CreateUnbilledTxnDto} dto - The data transfer object for creating the transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the newly created UnbilledTxn entity.
   */
  async createUnbilledTxn(dto: CreateUnbilledTxnDto): Promise<UnbilledTxn> {
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
      }
    }

    const unbilledTxn = this.unbilledTxnRepo.create({
      ...dto,
      rate,
      amount,
      ts: new Date(),
      billed: false,
    });

    return this.unbilledTxnRepo.save(unbilledTxn);
  }

  /**
   * @method createReceiptTxn
   * @description A convenience method to create an unbilled transaction specifically for a receipt operation.
   * @param {object} dto - The data for the receipt transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the created transaction.
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
      ...dto,
      serviceType: 'RECEIPT',
      description: `استلام ${dto.itemSku}`,
      metadata: { operation: 'receipt' },
    });
  }

  /**
   * @method createPickingTxn
   * @description A convenience method to create an unbilled transaction specifically for a picking operation.
   * @param {object} dto - The data for the picking transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the created transaction.
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
      ...dto,
      serviceType: 'PICKING',
      description: `انتقاء ${dto.itemSku}`,
      metadata: { operation: 'picking' },
    });
  }

  /**
   * @method createPackingTxn
   * @description A convenience method to create an unbilled transaction specifically for a packing operation.
   * @param {object} dto - The data for the packing transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the created transaction.
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
      ...dto,
      serviceType: 'PACKING',
      description: `تعبئة ${dto.itemSku}`,
      metadata: { operation: 'packing' },
    });
  }

  /**
   * @method createStorageTxn
   * @description A convenience method to create an unbilled transaction specifically for a storage operation.
   * @param {object} dto - The data for the storage transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the created transaction.
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
      ...dto,
      orderId: undefined,
      orderLineId: undefined,
      serviceType: 'STORAGE',
      description: `تخزين ${dto.itemSku}${dto.storageDays ? ` (${dto.storageDays} يوم)` : ''}`,
      metadata: { operation: 'storage', storageDays: dto.storageDays },
    });
  }

  /**
   * @method createDeliveryTxn
   * @description A convenience method to create an unbilled transaction specifically for a delivery operation.
   * @param {object} dto - The data for the delivery transaction.
   * @returns {Promise<UnbilledTxn>} A promise that resolves to the created transaction.
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
      ...dto,
      orderLineId: undefined,
      binId: undefined,
      lotId: undefined,
      serviceType: 'DELIVERY',
      description: `توصيل ${dto.itemSku}${dto.deliveryAddress ? ` إلى ${dto.deliveryAddress}` : ''}`,
      metadata: { operation: 'delivery', deliveryAddress: dto.deliveryAddress, distance: dto.distance },
    });
  }

  /**
   * @method getUnbilledTxns
   * @description Retrieves all unbilled transactions for a specific customer within a given date range.
   * @param {string} customerId - The ID of the customer.
   * @param {Date} from - The start date of the period.
   * @param {Date} to - The end date of the period.
   * @returns {Promise<UnbilledTxn[]>} A promise that resolves to an array of unbilled transactions.
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
   * @method markAsBilled
   * @description Marks a list of transactions as billed by associating them with an invoice.
   * @param {string[]} transactionIds - An array of transaction IDs to mark as billed.
   * @param {string} invoiceId - The ID of the invoice to associate with the transactions.
   * @returns {Promise<void>}
   */
  async markAsBilled(transactionIds: string[], invoiceId: string): Promise<void> {
    await this.unbilledTxnRepo.update(
      { id: In(transactionIds) },
      { billed: true, invoiceId },
    );
  }
}