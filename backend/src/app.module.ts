import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Database configuration
import { dataSourceOptions } from './database/data-source';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ItemsModule } from './modules/items/items.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WmsModule } from './modules/wms/wms.module';
import { CustomerPortalModule } from './modules/customer-portal/customer-portal.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RoutesModule } from './modules/routes/routes.module';
import { BillingModule } from './modules/billing/billing.module';
import { ReportsModule } from './modules/reports/reports.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';

// Common modules
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRoot(dataSourceOptions),

    // Queue management
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Event system
    EventEmitterModule.forRoot(),

    // Application modules
    CommonModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ContractsModule,
    ItemsModule,
    WarehousesModule,
    InventoryModule,
    OrdersModule,
    WmsModule,
    CustomerPortalModule,
    RoutesModule,
    BillingModule,
    ReportsModule,
    WebhooksModule,
    NotificationsModule,
  ],
})
export class AppModule {}
