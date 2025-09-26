import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { RateCardController } from './controllers/rate-card.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { PaymentController } from './controllers/payment.controller';
import { BatchBillingController } from './controllers/batch-billing.controller';
import { RateCardService } from './services/rate-card.service';
import { InvoiceService } from './services/invoice.service';
import { PaymentService } from './services/payment.service';
import { PricingEngineService } from './services/pricing-engine.service';
import { UnbilledTxnService } from './services/unbilled-txn.service';
import { BatchBillingService } from './services/batch-billing.service';
import { PdfExportService } from './services/pdf-export.service';
import { RateCard, RateCardRule } from '../../database/entities/rate-card.entity';
import { UnbilledTxn, Invoice, InvoiceLine, Payment } from '../../database/entities/billing.entity';
import { Customer } from '../../database/entities/customer.entity';
import { Order, OrderLine } from '../../database/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RateCard,
      RateCardRule,
      UnbilledTxn,
      Invoice,
      InvoiceLine,
      Payment,
      Customer,
      Order,
      OrderLine,
    ]),
  ],
  controllers: [
    BillingController,
    RateCardController,
    InvoiceController,
    PaymentController,
    BatchBillingController,
  ],
  providers: [
    BillingService,
    RateCardService,
    InvoiceService,
    PaymentService,
    PricingEngineService,
    UnbilledTxnService,
    BatchBillingService,
    PdfExportService,
  ],
  exports: [
    BillingService,
    RateCardService,
    InvoiceService,
    PaymentService,
    PricingEngineService,
    UnbilledTxnService,
    BatchBillingService,
    PdfExportService,
  ],
})
export class BillingModule {}
