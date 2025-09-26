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
exports.CustomerShipmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const route_entity_1 = require("../../../database/entities/route.entity");
const order_entity_1 = require("../../../database/entities/order.entity");
let CustomerShipmentsService = class CustomerShipmentsService {
    constructor(routeRepo, routeStopRepo, epodRepo, orderRepo) {
        this.routeRepo = routeRepo;
        this.routeStopRepo = routeStopRepo;
        this.epodRepo = epodRepo;
        this.orderRepo = orderRepo;
    }
    async getShipments(customerId, status) {
        const query = this.routeStopRepo
            .createQueryBuilder('stop')
            .leftJoinAndSelect('stop.route', 'route')
            .leftJoinAndSelect('stop.order', 'order')
            .leftJoinAndSelect('order.customer', 'customer')
            .where('order.customerId = :customerId', { customerId });
        if (status) {
            query.andWhere('stop.status = :status', { status });
        }
        return query.getMany();
    }
    async trackShipment(trackingNumber) {
        return {
            trackingNumber,
            status: 'IN_TRANSIT',
            currentLocation: 'Distribution Center',
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            history: [
                {
                    status: 'PICKED_UP',
                    location: 'Warehouse',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    status: 'IN_TRANSIT',
                    location: 'Distribution Center',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                },
            ],
        };
    }
};
exports.CustomerShipmentsService = CustomerShipmentsService;
exports.CustomerShipmentsService = CustomerShipmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(route_entity_1.Route)),
    __param(1, (0, typeorm_1.InjectRepository)(route_entity_1.RouteStop)),
    __param(2, (0, typeorm_1.InjectRepository)(route_entity_1.EPod)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomerShipmentsService);
//# sourceMappingURL=customer-shipments.service.js.map