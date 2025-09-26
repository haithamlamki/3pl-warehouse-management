import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsnController } from './controllers/asn.controller';
import { ReceiptsController } from './controllers/receipts.controller';
import { PutawayController } from './controllers/putaway.controller';
import { PicksController } from './controllers/picks.controller';
import { PacksController } from './controllers/packs.controller';
import { AsnService } from './services/asn.service';
import { ReceiptsService } from './services/receipts.service';
import { PutawayService } from './services/putaway.service';
import { PicksService } from './services/picks.service';
import { PacksService } from './services/packs.service';
import { Order, OrderLine } from '../../database/entities/order.entity';
import { Inventory } from '../../database/entities/inventory.entity';
import { Item, Lot } from '../../database/entities/item.entity';
import { Warehouse, Bin } from '../../database/entities/warehouse.entity';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderLine, Inventory, Item, Lot, Warehouse, Bin]),
    BillingModule,
  ],
  controllers: [
    AsnController,
    ReceiptsController,
    PutawayController,
    PicksController,
    PacksController,
  ],
  providers: [AsnService, ReceiptsService, PutawayService, PicksService, PacksService],
  exports: [PicksService, ReceiptsService],
})
export class WmsModule {}


