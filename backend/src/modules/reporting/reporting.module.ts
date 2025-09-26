import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
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
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}
