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
export declare class UnbilledTxnService {
    private readonly unbilledTxnRepo;
    private readonly rateCardRepo;
    private readonly pricingEngine;
    constructor(unbilledTxnRepo: Repository<UnbilledTxn>, rateCardRepo: Repository<RateCard>, pricingEngine: PricingEngineService);
    createUnbilledTxn(dto: CreateUnbilledTxnDto): Promise<UnbilledTxn>;
    createReceiptTxn(dto: {
        customerId: string;
        orderId: string;
        orderLineId: string;
        itemSku: string;
        qty: number;
        uom: string;
        warehouseId: string;
        binId?: string;
        lotId?: string;
    }): Promise<UnbilledTxn>;
    createPickingTxn(dto: {
        customerId: string;
        orderId: string;
        orderLineId: string;
        itemSku: string;
        qty: number;
        uom: string;
        warehouseId: string;
        binId?: string;
        lotId?: string;
    }): Promise<UnbilledTxn>;
    createPackingTxn(dto: {
        customerId: string;
        orderId: string;
        orderLineId: string;
        itemSku: string;
        qty: number;
        uom: string;
        warehouseId: string;
        binId?: string;
        lotId?: string;
    }): Promise<UnbilledTxn>;
    createStorageTxn(dto: {
        customerId: string;
        itemSku: string;
        qty: number;
        uom: string;
        warehouseId: string;
        binId?: string;
        lotId?: string;
        storageDays?: number;
    }): Promise<UnbilledTxn>;
    createDeliveryTxn(dto: {
        customerId: string;
        orderId: string;
        itemSku: string;
        qty: number;
        uom: string;
        warehouseId: string;
        deliveryAddress?: string;
        distance?: number;
    }): Promise<UnbilledTxn>;
    getUnbilledTxns(customerId: string, from: Date, to: Date): Promise<UnbilledTxn[]>;
    markAsBilled(transactionIds: string[], invoiceId: string): Promise<void>;
}
