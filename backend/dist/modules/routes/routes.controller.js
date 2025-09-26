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
exports.RoutesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const routes_service_1 = require("./routes.service");
const create_route_dto_1 = require("./dto/create-route.dto");
const update_route_dto_1 = require("./dto/update-route.dto");
const complete_stop_dto_1 = require("./dto/complete-stop.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
let RoutesController = class RoutesController {
    constructor(routesService) {
        this.routesService = routesService;
    }
    async create(createRouteDto) {
        return this.routesService.create(createRouteDto);
    }
    async findAll() {
        return this.routesService.findAll();
    }
    async myRoutes(req) {
        return this.routesService.findDriverRoutes(req.user.id, req.user.tenantId);
    }
    async findOne(id) {
        return this.routesService.findOne(id);
    }
    async update(id, updateRouteDto) {
        return this.routesService.update(id, updateRouteDto);
    }
    async assignDriver(id, body) {
        return this.routesService.assignDriver(id, body.driverUserId);
    }
    async remove(id) {
        return this.routesService.remove(id);
    }
    async completeStop(routeId, stopId, dto) {
        return this.routesService.completeStop({ ...dto, routeId, stopId });
    }
};
exports.RoutesController = RoutesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create route' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Route created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_route_dto_1.CreateRouteDto]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all routes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Routes retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver'),
    (0, swagger_1.ApiOperation)({ summary: 'Get routes assigned to current driver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver routes retrieved' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "myRoutes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get route by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update route' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_route_dto_1.UpdateRouteDto]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/assign-driver'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign driver to route' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Driver assigned' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete route' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Route deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':routeId/stops/:stopId/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('driver', 'ops', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a route stop and attach ePOD' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stop completed with ePOD' }),
    __param(0, (0, common_1.Param)('routeId')),
    __param(1, (0, common_1.Param)('stopId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, complete_stop_dto_1.CompleteStopDto]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "completeStop", null);
exports.RoutesController = RoutesController = __decorate([
    (0, swagger_1.ApiTags)('routes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('routes'),
    __metadata("design:paramtypes", [routes_service_1.RoutesService])
], RoutesController);
//# sourceMappingURL=routes.controller.js.map