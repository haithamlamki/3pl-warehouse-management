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
exports.CustomerOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_orders_service_1 = require("../services/customer-orders.service");
const create_order_dto_1 = require("../dto/create-order.dto");
let CustomerOrdersController = class CustomerOrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async getOrders(customerId, status, type) {
        return this.ordersService.getOrders(customerId, status, type);
    }
    async createOrder(dto) {
        return this.ordersService.createOrder(dto);
    }
    async getOrderDetails(id) {
        return this.ordersService.getOrderDetails(id);
    }
};
exports.CustomerOrdersController = CustomerOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order details retrieved' }),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerOrdersController.prototype, "getOrderDetails", null);
exports.CustomerOrdersController = CustomerOrdersController = __decorate([
    (0, swagger_1.ApiTags)('customer-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-portal/orders'),
    __metadata("design:paramtypes", [customer_orders_service_1.CustomerOrdersService])
], CustomerOrdersController);
//# sourceMappingURL=customer-orders.controller.js.map