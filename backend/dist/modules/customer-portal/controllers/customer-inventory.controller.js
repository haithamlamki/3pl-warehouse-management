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
exports.CustomerInventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_inventory_service_1 = require("../services/customer-inventory.service");
let CustomerInventoryController = class CustomerInventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getInventory(customerId) {
        return this.inventoryService.getInventorySnapshot(customerId);
    }
    async getMovements(customerId, from, to) {
        return this.inventoryService.getMovements(customerId, from, to);
    }
};
exports.CustomerInventoryController = CustomerInventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer inventory snapshot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory snapshot retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerInventoryController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory movements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory movements retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerInventoryController.prototype, "getMovements", null);
exports.CustomerInventoryController = CustomerInventoryController = __decorate([
    (0, swagger_1.ApiTags)('customer-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-portal/inventory'),
    __metadata("design:paramtypes", [customer_inventory_service_1.CustomerInventoryService])
], CustomerInventoryController);
//# sourceMappingURL=customer-inventory.controller.js.map