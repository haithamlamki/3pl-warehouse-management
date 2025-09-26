"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbilledTxnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_entity_1 = require("../../database/entities/billing.entity");
const rate_card_entity_1 = require("../../database/entities/rate-card.entity");
const pricing_engine_service_1 = require("./pricing-engine.service");
let UnbilledTxnService = class UnbilledTxnService {
    constructor(unbilledTxnRepo, rateCardRepo, pricingEngine) {
        this.unbilledTxnRepo = unbilledTxnRepo;
        this.rateCardRepo = rateCardRepo;
        this.pricingEngine = pricingEngine;
    }
    async createUnbilledTxn(dto) {
        const rateCard = await this.rateCardRepo.findOne({
            where: { customerId: dto.customerId, active: true },
            relations: ['rules'],
        });
        let rate = 0;
        let amount = 0;
        if (rateCard) {
            try {
                const pricingResult = await this.pricingEngine.calculatePrice(rateCard, dto.serviceType, dto.qty, dto.uom);
                rate = pricingResult.appliedRule?.price || 0;
                amount = pricingResult.finalPrice;
            }
            catch (error) {
                console.warn(`Could not calculate price for ${dto.serviceType}: ${error.message}`);
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
    async createReceiptTxn(dto) {
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
    async createPickingTxn(dto) {
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
    async createPackingTxn(dto) {
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
    async createStorageTxn(dto) {
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
    async createDeliveryTxn(dto) {
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
    async getUnbilledTxns(customerId, from, to) {
        return this.unbilledTxnRepo.find({
            where: {
                customerId,
                billed: false,
                ts: {
                    $gte: from,
                    $lte: to,
                },
            },
            order: { ts: 'ASC' },
        });
    }
    async markAsBilled(transactionIds, invoiceId) {
        await this.unbilledTxnRepo.update({ id: { $in: transactionIds } }, { billed: true, invoiceId });
    }
};
exports.UnbilledTxnService = UnbilledTxnService;
exports.UnbilledTxnService = UnbilledTxnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_entity_1.UnbilledTxn)),
    __param(1, (0, typeorm_1.InjectRepository)(rate_card_entity_1.RateCard)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        pricing_engine_service_1.PricingEngineService])
], UnbilledTxnService);
//# sourceMappingURL=unbilled-txn.service.js.map