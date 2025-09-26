"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asn_controller_1 = require("./controllers/asn.controller");
const receipts_controller_1 = require("./controllers/receipts.controller");
const putaway_controller_1 = require("./controllers/putaway.controller");
const picks_controller_1 = require("./controllers/picks.controller");
const packs_controller_1 = require("./controllers/packs.controller");
const asn_service_1 = require("./services/asn.service");
const receipts_service_1 = require("./services/receipts.service");
const putaway_service_1 = require("./services/putaway.service");
const picks_service_1 = require("./services/picks.service");
const packs_service_1 = require("./services/packs.service");
const order_entity_1 = require("../../database/entities/order.entity");
const inventory_entity_1 = require("../../database/entities/inventory.entity");
const item_entity_1 = require("../../database/entities/item.entity");
const warehouse_entity_1 = require("../../database/entities/warehouse.entity");
const billing_module_1 = require("../billing/billing.module");
let WmsModule = class WmsModule {
};
exports.WmsModule = WmsModule;
exports.WmsModule = WmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, order_entity_1.OrderLine, inventory_entity_1.Inventory, item_entity_1.Item, item_entity_1.Lot, warehouse_entity_1.Warehouse, warehouse_entity_1.Bin]),
            billing_module_1.BillingModule,
        ],
        controllers: [
            asn_controller_1.AsnController,
            receipts_controller_1.ReceiptsController,
            putaway_controller_1.PutawayController,
            picks_controller_1.PicksController,
            packs_controller_1.PacksController,
        ],
        providers: [asn_service_1.AsnService, receipts_service_1.ReceiptsService, putaway_service_1.PutawayService, picks_service_1.PicksService, packs_service_1.PacksService],
        exports: [picks_service_1.PicksService, receipts_service_1.ReceiptsService],
    })
], WmsModule);
//# sourceMappingURL=wms.module.js.map