import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

// Entities
import { User, Role, UserRole } from '../database/entities/user.entity';
import { Customer, Contract } from '../database/entities/customer.entity';
import { Item, Lot } from '../database/entities/item.entity';
import { Warehouse, Bin } from '../database/entities/warehouse.entity';
import { Inventory } from '../database/entities/inventory.entity';
import { Order, OrderLine } from '../database/entities/order.entity';
import { Route, RouteStop, EPod } from '../database/entities/route.entity';
import { RateCard, RateCardRule } from '../database/entities/rate-card.entity';
import { UnbilledTxn, Invoice, InvoiceLine, Payment } from '../database/entities/billing.entity';

// Services
import { DatabaseService } from './services/database.service';
import { EmailService } from './services/email.service';
import { FileService } from './services/file.service';
import { AuditService } from './services/audit.service';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

// Decorators
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Tenant } from './decorators/tenant.decorator';

// Interceptors
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

// Filters
import { HttpExceptionFilter } from './filters/http-exception.filter';

// Pipes
import { ValidationPipe } from './pipes/validation.pipe';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole,
      Customer,
      Contract,
      Item,
      Lot,
      Warehouse,
      Bin,
      Inventory,
      Order,
      OrderLine,
      Route,
      RouteStop,
      EPod,
      RateCard,
      RateCardRule,
      UnbilledTxn,
      Invoice,
      InvoiceLine,
      Payment,
    ]),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'audit',
    }),
  ],
  providers: [
    DatabaseService,
    EmailService,
    FileService,
    AuditService,
    JwtAuthGuard,
    RolesGuard,
    AuditInterceptor,
    TransformInterceptor,
    HttpExceptionFilter,
    ValidationPipe,
  ],
  exports: [
    DatabaseService,
    EmailService,
    FileService,
    AuditService,
    JwtAuthGuard,
    RolesGuard,
    AuditInterceptor,
    TransformInterceptor,
    HttpExceptionFilter,
    ValidationPipe,
  ],
})
export class CommonModule {}
