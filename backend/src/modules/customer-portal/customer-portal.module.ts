import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerInventoryController } from './controllers/customer-inventory.controller';
import { CustomerOrdersController } from './controllers/customer-orders.controller';
import { CustomerShipmentsController } from './controllers/customer-shipments.controller';
import { CustomerInventoryService } from './services/customer-inventory.service';
import { CustomerOrdersService } from './services/customer-orders.service';
import { CustomerShipmentsService } from './services/customer-shipments.service';
import { Inventory } from '../../database/entities/inventory.entity';
import { Order, OrderLine } from '../../database/entities/order.entity';
import { Item, Lot } from '../../database/entities/item.entity';
import { Warehouse, Bin } from '../../database/entities/warehouse.entity';
import { Route, RouteStop, EPod } from '../../database/entities/route.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      Order,
      OrderLine,
      Item,
      Lot,
      Warehouse,
      Bin,
      Route,
      RouteStop,
      EPod,
    ]),
  ],
  controllers: [
    CustomerInventoryController,
    CustomerOrdersController,
    CustomerShipmentsController,
  ],
  providers: [
    CustomerInventoryService,
    CustomerOrdersService,
    CustomerShipmentsService,
  ],
})
export class CustomerPortalModule {}
