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
exports.OrderLine = exports.Order = exports.OwnerTypeEffective = exports.OrderStatus = exports.OrderType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const customer_entity_1 = require("./customer.entity");
const item_entity_1 = require("./item.entity");
var OrderType;
(function (OrderType) {
    OrderType["IN"] = "IN";
    OrderType["OUT"] = "OUT";
    OrderType["TRANSFER"] = "TRANSFER";
})(OrderType || (exports.OrderType = OrderType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["NEW"] = "NEW";
    OrderStatus["APPROVED"] = "APPROVED";
    OrderStatus["PICKING"] = "PICKING";
    OrderStatus["PACKED"] = "PACKED";
    OrderStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["RECEIVED"] = "RECEIVED";
    OrderStatus["CLOSED"] = "CLOSED";
    OrderStatus["ON_HOLD"] = "ON_HOLD";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var OwnerTypeEffective;
(function (OwnerTypeEffective) {
    OwnerTypeEffective["CONSIGNMENT"] = "CONSIGNMENT";
    OwnerTypeEffective["PURCHASE_FOR_CLIENT"] = "PURCHASE_FOR_CLIENT";
    OwnerTypeEffective["COMPANY_OWNED"] = "COMPANY_OWNED";
})(OwnerTypeEffective || (exports.OwnerTypeEffective = OwnerTypeEffective = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Order.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderType,
    }),
    __metadata("design:type", String)
], Order.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.NEW,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "slaTs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OwnerTypeEffective,
        default: OwnerTypeEffective.CONSIGNMENT,
    }),
    __metadata("design:type", String)
], Order.prototype, "ownerTypeEffective", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'createdBy' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderLine, (line) => line.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "lines", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders'),
    (0, typeorm_1.Index)(['tenantId', 'status']),
    (0, typeorm_1.Index)(['customerId', 'createdAt'])
], Order);
let OrderLine = class OrderLine {
};
exports.OrderLine = OrderLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], OrderLine.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], OrderLine.prototype, "itemSku", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], OrderLine.prototype, "lotId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3 }),
    __metadata("design:type", Number)
], OrderLine.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], OrderLine.prototype, "pickedQty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], OrderLine.prototype, "packedQty", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OwnerTypeEffective,
        default: OwnerTypeEffective.CONSIGNMENT,
    }),
    __metadata("design:type", String)
], OrderLine.prototype, "ownerTypeEffective", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], OrderLine.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderLine.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrderLine.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order, (order) => order.lines, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", Order)
], OrderLine.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'itemSku' }),
    __metadata("design:type", item_entity_1.Item)
], OrderLine.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Lot, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lotId' }),
    __metadata("design:type", item_entity_1.Lot)
], OrderLine.prototype, "lot", void 0);
exports.OrderLine = OrderLine = __decorate([
    (0, typeorm_1.Entity)('order_lines')
], OrderLine);
//# sourceMappingURL=order.entity.js.map