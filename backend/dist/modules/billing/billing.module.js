"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
const rate_card_controller_1 = require("./controllers/rate-card.controller");
const invoice_controller_1 = require("./controllers/invoice.controller");
const payment_controller_1 = require("./controllers/payment.controller");
const batch_billing_controller_1 = require("./controllers/batch-billing.controller");
const rate_card_service_1 = require("./services/rate-card.service");
const invoice_service_1 = require("./services/invoice.service");
const payment_service_1 = require("./services/payment.service");
const pricing_engine_service_1 = require("./services/pricing-engine.service");
const unbilled_txn_service_1 = require("./services/unbilled-txn.service");
const batch_billing_service_1 = require("./services/batch-billing.service");
const pdf_export_service_1 = require("./services/pdf-export.service");
const rate_card_entity_1 = require("../../database/entities/rate-card.entity");
const billing_entity_1 = require("../../database/entities/billing.entity");
const customer_entity_1 = require("../../database/entities/customer.entity");
const order_entity_1 = require("../../database/entities/order.entity");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                rate_card_entity_1.RateCard,
                rate_card_entity_1.RateCardRule,
                billing_entity_1.UnbilledTxn,
                billing_entity_1.Invoice,
                billing_entity_1.InvoiceLine,
                billing_entity_1.Payment,
                customer_entity_1.Customer,
                order_entity_1.Order,
                order_entity_1.OrderLine,
            ]),
        ],
        controllers: [
            billing_controller_1.BillingController,
            rate_card_controller_1.RateCardController,
            invoice_controller_1.InvoiceController,
            payment_controller_1.PaymentController,
            batch_billing_controller_1.BatchBillingController,
        ],
        providers: [
            billing_service_1.BillingService,
            rate_card_service_1.RateCardService,
            invoice_service_1.InvoiceService,
            payment_service_1.PaymentService,
            pricing_engine_service_1.PricingEngineService,
            unbilled_txn_service_1.UnbilledTxnService,
            batch_billing_service_1.BatchBillingService,
            pdf_export_service_1.PdfExportService,
        ],
        exports: [
            billing_service_1.BillingService,
            rate_card_service_1.RateCardService,
            invoice_service_1.InvoiceService,
            payment_service_1.PaymentService,
            pricing_engine_service_1.PricingEngineService,
            unbilled_txn_service_1.UnbilledTxnService,
            batch_billing_service_1.BatchBillingService,
            pdf_export_service_1.PdfExportService,
        ],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map