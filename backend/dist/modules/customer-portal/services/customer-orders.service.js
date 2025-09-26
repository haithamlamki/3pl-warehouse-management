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
exports.CustomerOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../../database/entities/order.entity");
let CustomerOrdersService = class CustomerOrdersService {
    constructor(orderRepo, orderLineRepo) {
        this.orderRepo = orderRepo;
        this.orderLineRepo = orderLineRepo;
    }
    async getOrders(customerId, status, type) {
        const query = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.lines', 'lines')
            .where('order.customerId = :customerId', { customerId });
        if (status) {
            query.andWhere('order.status = :status', { status });
        }
        if (type) {
            query.andWhere('order.type = :type', { type });
        }
        return query.getMany();
    }
    async createOrder(dto) {
        const order = this.orderRepo.create({
            tenantId: dto.tenantId,
            customerId: dto.customerId,
            type: dto.type,
            status: 'NEW',
            notes: dto.notes,
        });
        const savedOrder = await this.orderRepo.save(order);
        const orderLines = dto.lines.map((line) => this.orderLineRepo.create({
            orderId: savedOrder.id,
            itemSku: line.itemSku,
            qty: line.qty,
            lotId: line.lotId,
        }));
        await this.orderLineRepo.save(orderLines);
        return this.getOrderDetails(savedOrder.id);
    }
    async getOrderDetails(id) {
        return this.orderRepo.findOne({
            where: { id },
            relations: ['lines', 'lines.item', 'lines.lot'],
        });
    }
};
exports.CustomerOrdersService = CustomerOrdersService;
exports.CustomerOrdersService = CustomerOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CustomerOrdersService);
//# sourceMappingURL=customer-orders.service.js.map