"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPortalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_inventory_controller_1 = require("./controllers/customer-inventory.controller");
const customer_orders_controller_1 = require("./controllers/customer-orders.controller");
const customer_shipments_controller_1 = require("./controllers/customer-shipments.controller");
const customer_inventory_service_1 = require("./services/customer-inventory.service");
const customer_orders_service_1 = require("./services/customer-orders.service");
const customer_shipments_service_1 = require("./services/customer-shipments.service");
const inventory_entity_1 = require("../../database/entities/inventory.entity");
const order_entity_1 = require("../../database/entities/order.entity");
const item_entity_1 = require("../../database/entities/item.entity");
const warehouse_entity_1 = require("../../database/entities/warehouse.entity");
const route_entity_1 = require("../../database/entities/route.entity");
let CustomerPortalModule = class CustomerPortalModule {
};
exports.CustomerPortalModule = CustomerPortalModule;
exports.CustomerPortalModule = CustomerPortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                inventory_entity_1.Inventory,
                order_entity_1.Order,
                order_entity_1.OrderLine,
                item_entity_1.Item,
                item_entity_1.Lot,
                warehouse_entity_1.Warehouse,
                warehouse_entity_1.Bin,
                route_entity_1.Route,
                route_entity_1.RouteStop,
                route_entity_1.EPod,
            ]),
        ],
        controllers: [
            customer_inventory_controller_1.CustomerInventoryController,
            customer_orders_controller_1.CustomerOrdersController,
            customer_shipments_controller_1.CustomerShipmentsController,
        ],
        providers: [
            customer_inventory_service_1.CustomerInventoryService,
            customer_orders_service_1.CustomerOrdersService,
            customer_shipments_service_1.CustomerShipmentsService,
        ],
    })
], CustomerPortalModule);
//# sourceMappingURL=customer-portal.module.js.map