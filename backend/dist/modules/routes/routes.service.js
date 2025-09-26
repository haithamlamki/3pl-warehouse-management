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
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const route_entity_1 = require("../../database/entities/route.entity");
const order_entity_1 = require("../../database/entities/order.entity");
const invoice_service_1 = require("../billing/services/invoice.service");
let RoutesService = class RoutesService {
    constructor(routeRepository, stopRepository, epodRepository, orderRepository, invoiceService) {
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.epodRepository = epodRepository;
        this.orderRepository = orderRepository;
        this.invoiceService = invoiceService;
    }
    async create(createRouteDto) {
        const route = this.routeRepository.create(createRouteDto);
        return this.routeRepository.save(route);
    }
    async findAll() {
        return this.routeRepository.find({ relations: ['stops'] });
    }
    async findDriverRoutes(driverUserId, tenantId) {
        return this.routeRepository.find({ where: { driverUserId, tenantId }, relations: ['stops'] });
    }
    async findOne(id) {
        const route = await this.routeRepository.findOne({ where: { id } });
        if (!route) {
            throw new common_1.NotFoundException('Route not found');
        }
        return route;
    }
    async update(id, updateRouteDto) {
        const route = await this.findOne(id);
        Object.assign(route, updateRouteDto);
        return this.routeRepository.save(route);
    }
    async assignDriver(id, driverUserId) {
        const route = await this.findOne(id);
        route.driverUserId = driverUserId;
        return this.routeRepository.save(route);
    }
    async remove(id) {
        const route = await this.findOne(id);
        await this.routeRepository.remove(route);
    }
    async completeStop(dto) {
        const stop = await this.stopRepository.findOne({ where: { id: dto.stopId, routeId: dto.routeId } });
        if (!stop)
            throw new common_1.NotFoundException('Stop not found');
        stop.status = 'COMPLETED';
        stop.actualArrival = new Date();
        await this.stopRepository.save(stop);
        const epod = this.epodRepository.create({
            orderId: stop.orderId,
            signerName: dto.signerName,
            signerId: dto.signerId,
            photos: dto.photos,
            latitude: dto.latitude,
            longitude: dto.longitude,
            completedAt: new Date(),
            notes: dto.notes,
        });
        await this.epodRepository.save(epod);
        if (stop.orderId) {
            await this.orderRepository.update(stop.orderId, { status: 'DELIVERED' });
            const order = await this.orderRepository.findOne({ where: { id: stop.orderId } });
            if (order && order.ownerTypeEffective === order_entity_1.OwnerTypeEffective.PURCHASE_FOR_CLIENT) {
                try {
                    const invoice = await this.invoiceService.generatePurchaseForClientInvoice(stop.orderId);
                    console.log(`Generated invoice ${invoice.invoiceNumber} for PURCHASE_FOR_CLIENT order ${stop.orderId}`);
                }
                catch (error) {
                    console.error(`Failed to generate invoice for order ${stop.orderId}:`, error.message);
                }
            }
        }
        return { stopId: stop.id, status: stop.status, epodId: epod.id };
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(route_entity_1.Route)),
    __param(1, (0, typeorm_1.InjectRepository)(route_entity_1.RouteStop)),
    __param(2, (0, typeorm_1.InjectRepository)(route_entity_1.EPod)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoice_service_1.InvoiceService])
], RoutesService);
//# sourceMappingURL=routes.service.js.map