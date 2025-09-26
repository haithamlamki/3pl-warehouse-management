import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Order, Inventory, Item, Customer, Invoice, Payment } from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Inventory,
      Item,
      Customer,
      Invoice,
      Payment,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
