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
exports.PicksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../database/entities/order.entity");
const inventory_entity_1 = require("../../database/entities/inventory.entity");
const unbilled_txn_service_1 = require("../../billing/services/unbilled-txn.service");
let PicksService = class PicksService {
    constructor(orderRepo, orderLineRepo, inventoryRepo, unbilledTxnService) {
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
        this.inventoryRepo = inventoryRepo;
        this.unbilledTxnService = unbilledTxnService;
    }
    async createWave(dto) {
        const orders = await this.orderRepo.find({
            where: {
                id: { $in: dto.orderIds },
                status: order_entity_1.OrderStatus.APPROVED,
                type: 'OUT'
            },
            relations: ['lines', 'customer'],
        });
        if (orders.length !== dto.orderIds.length) {
            throw new Error('Some orders are not in APPROVED status or not OUT type');
        }
        const waveId = 'wave_' + Date.now();
        await this.orderRepo.update({ id: { $in: dto.orderIds } }, { status: order_entity_1.OrderStatus.PICKING });
        return {
            waveId,
            orders: dto.orderIds,
            status: 'CREATED',
            orderCount: orders.length
        };
    }
    async completeWave(dto) {
        const orders = await this.orderRepo.find({
            where: { id: { $in: dto.packedOrderIds } },
            relations: ['lines', 'customer'],
        });
        for (const order of orders) {
            await this.orderRepo.update(order.id, { status: order_entity_1.OrderStatus.PACKED });
            for (const orderLine of order.lines) {
                await this.unbilledTxnService.createPickingTxn({
                    customerId: order.customerId,
                    orderId: order.id,
                    orderLineId: orderLine.id,
                    itemSku: orderLine.itemSku,
                    qty: orderLine.pickedQty || orderLine.qty,
                    uom: 'PCS',
                    warehouseId: 'default-warehouse',
                    binId: orderLine.lotId,
                    lotId: orderLine.lotId,
                });
                await this.unbilledTxnService.createPackingTxn({
                    customerId: order.customerId,
                    orderId: order.id,
                    orderLineId: orderLine.id,
                    itemSku: orderLine.itemSku,
                    qty: orderLine.packedQty || orderLine.qty,
                    uom: 'PCS',
                    warehouseId: 'default-warehouse',
                    binId: orderLine.lotId,
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
    async fulfillOrder(orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['lines'],
        });
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.status !== order_entity_1.OrderStatus.PACKED) {
            throw new Error('Order must be in PACKED status to fulfill');
        }
        for (const orderLine of order.lines) {
            const inventory = await this.inventoryRepo.findOne({
                where: {
                    itemSku: orderLine.itemSku,
                    lotId: orderLine.lotId,
                    ownerType: 'client',
                    ownerId: order.customerId,
                },
            });
            if (inventory) {
                const fulfillQty = orderLine.packedQty || orderLine.qty;
                if (inventory.availableQty < fulfillQty) {
                    throw new Error(`Insufficient inventory for ${orderLine.itemSku}. Available: ${inventory.availableQty}, Required: ${fulfillQty}`);
                }
                inventory.availableQty -= fulfillQty;
                inventory.qty -= fulfillQty;
                await this.inventoryRepo.save(inventory);
            }
        }
        await this.orderRepo.update(orderId, { status: order_entity_1.OrderStatus.OUT_FOR_DELIVERY });
    }
};
exports.PicksService = PicksService;
exports.PicksService = PicksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderLine)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        unbilled_txn_service_1.UnbilledTxnService])
], PicksService);
//# sourceMappingURL=picks.service.js.map