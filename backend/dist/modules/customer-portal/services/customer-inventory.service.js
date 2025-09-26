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
exports.CustomerInventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_entity_1 = require("../../../database/entities/inventory.entity");
const item_entity_1 = require("../../../database/entities/item.entity");
const warehouse_entity_1 = require("../../../database/entities/warehouse.entity");
const warehouse_entity_2 = require("../../../database/entities/warehouse.entity");
let CustomerInventoryService = class CustomerInventoryService {
    constructor(inventoryRepo, itemRepo, warehouseRepo, binRepo) {
        this.inventoryRepo = inventoryRepo;
        this.itemRepo = itemRepo;
        this.warehouseRepo = warehouseRepo;
        this.binRepo = binRepo;
    }
    async getInventorySnapshot(customerId) {
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
    async getMovements(customerId, from, to) {
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
};
exports.CustomerInventoryService = CustomerInventoryService;
exports.CustomerInventoryService = CustomerInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_entity_1.Inventory)),
    __param(1, (0, typeorm_1.InjectRepository)(item_entity_1.Item)),
    __param(2, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(3, (0, typeorm_1.InjectRepository)(warehouse_entity_2.Bin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomerInventoryService);
//# sourceMappingURL=customer-inventory.service.js.map