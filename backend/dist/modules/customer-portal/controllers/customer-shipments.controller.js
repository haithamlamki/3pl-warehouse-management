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
exports.CustomerShipmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_shipments_service_1 = require("../services/customer-shipments.service");
let CustomerShipmentsController = class CustomerShipmentsController {
    constructor(shipmentsService) {
        this.shipmentsService = shipmentsService;
    }
    async getShipments(customerId, status) {
        return this.shipmentsService.getShipments(customerId, status);
    }
    async trackShipment(trackingNumber) {
        return this.shipmentsService.trackShipment(trackingNumber);
    }
};
exports.CustomerShipmentsController = CustomerShipmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer shipments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipments retrieved' }),
    __param(0, (0, common_1.Query)('customerId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomerShipmentsController.prototype, "getShipments", null);
__decorate([
    (0, common_1.Get)('tracking/:trackingNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Track shipment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tracking information retrieved' }),
    __param(0, (0, common_1.Query)('trackingNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerShipmentsController.prototype, "trackShipment", null);
exports.CustomerShipmentsController = CustomerShipmentsController = __decorate([
    (0, swagger_1.ApiTags)('customer-portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('customer-portal/shipments'),
    __metadata("design:paramtypes", [customer_shipments_service_1.CustomerShipmentsService])
], CustomerShipmentsController);
//# sourceMappingURL=customer-shipments.controller.js.map