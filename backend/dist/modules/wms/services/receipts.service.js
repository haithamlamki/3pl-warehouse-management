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
exports.ReceiptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../database/entities/order.entity");
const inventory_entity_1 = require("../../database/entities/inventory.entity");
const unbilled_txn_service_1 = require("../../billing/services/unbilled-txn.service");
let ReceiptsService = class ReceiptsService {
    constructor(orderRepo, orderLineRepo, inventoryRepo, unbilledTxnService) {
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
        this.inventoryRepo = inventoryRepo;
        this.unbilledTxnService = unbilledTxnService;
    }
    async postReceipt(dto) {
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
        for (const receiptLine of dto.lines) {
            const orderLine = order.lines.find(line => line.id === receiptLine.orderLineId);
            if (!orderLine) {
                throw new Error(`Order line ${receiptLine.orderLineId} not found`);
            }
            let inventory = await this.inventoryRepo.findOne({
                where: {
                    itemSku: orderLine.itemSku,
                    lotId: receiptLine.lotId,
                    ownerType: inventory_entity_1.OwnerType.CLIENT,
                    ownerId: order.customerId,
                    warehouseId: dto.warehouseId,
                    binId: receiptLine.binId,
                },
            });
            if (inventory) {
                inventory.qty += receiptLine.receivedQty;
                inventory.availableQty += receiptLine.receivedQty;
            }
            else {
                inventory = this.inventoryRepo.create({
                    itemSku: orderLine.itemSku,
                    lotId: receiptLine.lotId,
                    ownerType: inventory_entity_1.OwnerType.CLIENT,
                    ownerId: order.customerId,
                    warehouseId: dto.warehouseId,
                    binId: receiptLine.binId,
                    qty: receiptLine.receivedQty,
                    availableQty: receiptLine.receivedQty,
                    reservedQty: 0,
                });
            }
            await this.inventoryRepo.save(inventory);
            await this.unbilledTxnService.createReceiptTxn({
                customerId: order.customerId,
                orderId: order.id,
                orderLineId: orderLine.id,
                itemSku: orderLine.itemSku,
                qty: receiptLine.receivedQty,
                uom: 'PCS',
                warehouseId: dto.warehouseId,
                binId: receiptLine.binId,
                lotId: receiptLine.lotId,
            });
        }
        await this.orderRepo.update(order.id, { status: order_entity_1.OrderStatus.RECEIVED });
        return {
            receiptId: 'rcpt_' + Date.now(),
            orderId: order.id,
            status: 'RECEIVED',
            linesProcessed: dto.lines.length
        };
    }
    async startCycleCount(dto) {
        return { cycleCountId: 'cc_' + Date.now(), status: 'STARTED', ...dto };
    }
    async postCycleCount(dto) {
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
                    inventory.qty = discrepancy.countedQty;
                    inventory.availableQty = discrepancy.countedQty;
                    await this.inventoryRepo.save(inventory);
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
};
exports.ReceiptsService = ReceiptsService;
exports.ReceiptsService = ReceiptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderLine)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        unbilled_txn_service_1.UnbilledTxnService])
], ReceiptsService);
//# sourceMappingURL=receipts.service.js.map