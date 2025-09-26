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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = exports.OwnerType = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
const item_entity_1 = require("./item.entity");
const warehouse_entity_1 = require("./warehouse.entity");
var OwnerType;
(function (OwnerType) {
    OwnerType["CLIENT"] = "client";
    OwnerType["COMPANY"] = "company";
})(OwnerType || (exports.OwnerType = OwnerType = {}));
let Inventory = class Inventory {
};
exports.Inventory = Inventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Inventory.prototype, "itemSku", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OwnerType,
    }),
    __metadata("design:type", String)
], Inventory.prototype, "ownerType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Inventory.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Inventory.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Inventory.prototype, "binId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Inventory.prototype, "lotId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Inventory.prototype, "serialNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3 }),
    __metadata("design:type", Number)
], Inventory.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], Inventory.prototype, "reservedQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], Inventory.prototype, "availableQty", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inventory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Inventory.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'itemSku' }),
    __metadata("design:type", item_entity_1.Item)
], Inventory.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], Inventory.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'warehouseId' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], Inventory.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Bin, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'binId' }),
    __metadata("design:type", warehouse_entity_1.Bin)
], Inventory.prototype, "bin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Lot, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lotId' }),
    __metadata("design:type", item_entity_1.Lot)
], Inventory.prototype, "lot", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)('inventory'),
    (0, typeorm_1.Index)(['itemSku']),
    (0, typeorm_1.Index)(['warehouseId', 'binId']),
    (0, typeorm_1.Unique)(['itemSku', 'ownerType', 'ownerId', 'warehouseId', 'binId', 'lotId'])
], Inventory);
//# sourceMappingURL=inventory.entity.js.map