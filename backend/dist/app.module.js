"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const event_emitter_1 = require("@nestjs/event-emitter");
const data_source_1 = require("./database/data-source");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const customers_module_1 = require("./modules/customers/customers.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const items_module_1 = require("./modules/items/items.module");
const warehouses_module_1 = require("./modules/warehouses/warehouses.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const wms_module_1 = require("./modules/wms/wms.module");
const customer_portal_module_1 = require("./modules/customer-portal/customer-portal.module");
const orders_module_1 = require("./modules/orders/orders.module");
const routes_module_1 = require("./modules/routes/routes.module");
const billing_module_1 = require("./modules/billing/billing.module");
const reports_module_1 = require("./modules/reports/reports.module");
const webhooks_module_1 = require("./modules/webhooks/webhooks.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const health_module_1 = require("./modules/health/health.module");
const common_module_1 = require("./common/common.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRoot(data_source_1.dataSourceOptions),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD,
                },
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            common_module_1.CommonModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            customers_module_1.CustomersModule,
            contracts_module_1.ContractsModule,
            items_module_1.ItemsModule,
            warehouses_module_1.WarehousesModule,
            inventory_module_1.InventoryModule,
            orders_module_1.OrdersModule,
            wms_module_1.WmsModule,
            customer_portal_module_1.CustomerPortalModule,
            routes_module_1.RoutesModule,
            billing_module_1.BillingModule,
            reports_module_1.ReportsModule,
            webhooks_module_1.WebhooksModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map