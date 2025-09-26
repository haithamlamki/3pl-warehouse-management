"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const user_entity_1 = require("../database/entities/user.entity");
const customer_entity_1 = require("../database/entities/customer.entity");
const item_entity_1 = require("../database/entities/item.entity");
const warehouse_entity_1 = require("../database/entities/warehouse.entity");
const inventory_entity_1 = require("../database/entities/inventory.entity");
const order_entity_1 = require("../database/entities/order.entity");
const route_entity_1 = require("../database/entities/route.entity");
const rate_card_entity_1 = require("../database/entities/rate-card.entity");
const billing_entity_1 = require("../database/entities/billing.entity");
const database_service_1 = require("./services/database.service");
const email_service_1 = require("./services/email.service");
const file_service_1 = require("./services/file.service");
const audit_service_1 = require("./services/audit.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const audit_interceptor_1 = require("./interceptors/audit.interceptor");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const validation_pipe_1 = require("./pipes/validation.pipe");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_entity_1.Role,
                user_entity_1.UserRole,
                customer_entity_1.Customer,
                customer_entity_1.Contract,
                item_entity_1.Item,
                item_entity_1.Lot,
                warehouse_entity_1.Warehouse,
                warehouse_entity_1.Bin,
                inventory_entity_1.Inventory,
                order_entity_1.Order,
                order_entity_1.OrderLine,
                route_entity_1.Route,
                route_entity_1.RouteStop,
                route_entity_1.EPod,
                rate_card_entity_1.RateCard,
                rate_card_entity_1.RateCardRule,
                billing_entity_1.UnbilledTxn,
                billing_entity_1.Invoice,
                billing_entity_1.InvoiceLine,
                billing_entity_1.Payment,
            ]),
            bull_1.BullModule.registerQueue({
                name: 'email',
            }),
            bull_1.BullModule.registerQueue({
                name: 'audit',
            }),
        ],
        providers: [
            database_service_1.DatabaseService,
            email_service_1.EmailService,
            file_service_1.FileService,
            audit_service_1.AuditService,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            audit_interceptor_1.AuditInterceptor,
            transform_interceptor_1.TransformInterceptor,
            http_exception_filter_1.HttpExceptionFilter,
            validation_pipe_1.ValidationPipe,
        ],
        exports: [
            database_service_1.DatabaseService,
            email_service_1.EmailService,
            file_service_1.FileService,
            audit_service_1.AuditService,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            audit_interceptor_1.AuditInterceptor,
            transform_interceptor_1.TransformInterceptor,
            http_exception_filter_1.HttpExceptionFilter,
            validation_pipe_1.ValidationPipe,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map