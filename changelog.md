# Changelog

All notable changes to the 3PL Warehouse Management System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-09-26

### Added
- **Billing V1 Complete**: Full billing system with automatic RateCards usage
  - `UnbilledTxnService`: Automatic transaction creation for all WMS operations
  - `BatchBillingService`: Monthly billing cycle for all customers
  - `PdfExportService`: HTML/PDF and CSV export for invoices
  - Endpoints: `POST /billing/run-cycle`, `GET /billing/summary`, `POST /invoices/export/csv`
- **WMS OUT Flow Complete**: Full order fulfillment workflow
  - Order flow: APPROVED → PICKING → PACKED → OUT_FOR_DELIVERY → DELIVERED → CLOSED
  - `PicksService`: Wave creation, completion, and order fulfillment
  - `ReceiptsService`: Inventory updates and transaction creation
  - Endpoints: `POST /picks/fulfill/:orderId` for inventory reduction
- **Automatic Billing Integration**: All WMS operations now create UnbilledTxn automatically
  - Receipt operations: `RECEIPT` transactions
  - Picking operations: `PICKING` transactions  
  - Packing operations: `PACKING` transactions
  - Cycle count adjustments: `INVENTORY_ADJUSTMENT` transactions
- **Inventory Management**: Real-time inventory updates
  - Receipt: Increase inventory quantities
  - Fulfill: Decrease inventory quantities after picking
  - Cycle count: Adjust inventory based on physical counts

### Changed
- **WMS Services**: Enhanced with TypeORM repositories and billing integration
- **Order Status Flow**: Complete OUT order lifecycle management
- **Billing Module**: Added new services and controllers for comprehensive billing

### Fixed
- **Entity Dependencies**: Resolved all TypeScript compilation errors
- **Module Imports**: Added proper BillingModule imports to WMS modules

## [1.0.3] - 2025-09-26

### Added
- **Health Check Endpoints**: Added `/` and `/ready` endpoints for service health monitoring
- **Owner Type Effective System**: Added `OwnerTypeEffective` enum to support different ownership models:
  - `CONSIGNMENT`: وديعة العميل - الفوترة = خدمات فقط
  - `PURCHASE_FOR_CLIENT`: الشركة مالك مؤقت - عند ePOD يُصدر فاتورة بيع + خدمات
  - `COMPANY_OWNED`: ملكية الشركة
- **Purchase-for-Client Invoice Generation**: Automatic invoice generation upon ePOD completion for `PURCHASE_FOR_CLIENT` orders
- **Enhanced Order Lines**: Added `unitPrice` field for sale pricing in `PURCHASE_FOR_CLIENT` scenarios

### Changed
- **Swagger Documentation**: Moved from `/api/docs` to `/docs` for cleaner URL structure
- **Database Schema**: Added `ownerTypeEffective` and `unitPrice` columns to `orders` and `order_lines` tables
- **Invoice Generation Logic**: Enhanced to support both consignment and purchase-for-client billing models

### Fixed
- **Entity Import Dependencies**: Fixed missing TypeScript imports in entity files that were causing compilation failures:
  - `inventory.entity.ts`: Added missing imports for `Item`, `Lot`, `Warehouse`, `Bin`
  - `order.entity.ts`: Added missing imports for `Item`, `Lot`
  - `item.entity.ts`: Added missing import for `Inventory` and fixed `PrimaryGeneratedColumn` usage
  - `warehouse.entity.ts`: Added missing import for `Inventory`
  - `customer.entity.ts`: Added missing imports for `RateCard`, `Order`, `Inventory`
- **TypeORM Decorator Issues**: Fixed `PrimaryGeneratedColumn('varchar')` to use `PrimaryColumn({ type: 'varchar' })` for string primary keys
- **Test Coverage**: Added comprehensive test for `Inventory` entity to verify compilation and decorator functionality

## [1.0.2] - 2025-09-26

### Fixed
- **Entity Import Dependencies**: Fixed missing TypeScript imports in entity files that were causing compilation failures:
  - `inventory.entity.ts`: Added missing imports for `Item`, `Lot`, `Warehouse`, `Bin`
  - `order.entity.ts`: Added missing imports for `Item`, `Lot`
  - `item.entity.ts`: Added missing import for `Inventory` and fixed `PrimaryGeneratedColumn` usage
  - `warehouse.entity.ts`: Added missing import for `Inventory`
  - `customer.entity.ts`: Added missing imports for `RateCard`, `Order`, `Inventory`
- **TypeORM Decorator Issues**: Fixed `PrimaryGeneratedColumn('varchar')` to use `PrimaryColumn({ type: 'varchar' })` for string primary keys
- **Test Coverage**: Added comprehensive test for `Inventory` entity to verify compilation and decorator functionality

### Changed
- Entity files now have proper circular import resolution for TypeORM relationships
- All entity decorators now compile without TypeScript errors

## [1.0.0] - 2025-01-26

### Added
- **Project Structure**: Created comprehensive project structure with backend (NestJS) and frontend (Next.js)
- **Database Schema**: Implemented PostgreSQL database schema with all core entities:
  - User management (users, roles, user_roles)
  - Customer management (customers, contracts)
  - Inventory management (items, lots, warehouses, bins, inventory)
  - Order management (orders, order_lines)
  - Route management (routes, route_stops, epod)
  - Billing system (rate_cards, rate_card_rules, unbilled_txns, invoices, invoice_lines, payments)
- **Authentication System**: 
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (RBAC)
  - Password hashing with bcrypt
  - Login, register, logout, and profile management endpoints
- **Backend Infrastructure**:
  - NestJS application setup with TypeORM
  - Swagger API documentation
  - Environment configuration
  - Common services (Database, Email, File, Audit)
  - Guards, decorators, interceptors, and filters
- **Frontend Infrastructure**:
  - Next.js 14 setup with TypeScript
  - Tailwind CSS for styling
  - Internationalization support (English/Arabic)
  - React Query for state management
  - Form handling with React Hook Form and Zod validation
- **Development Tools**:
  - ESLint and Prettier configuration
  - TypeScript configuration
  - Package.json scripts for development, building, and testing

### New
- Contracts module with endpoints:
  - `POST /contracts` to create contract from template
  - `POST /contracts/:id/sign` to apply e-signature and mark as signed
  - DTOs: `CreateContractDto`, `SignContractDto`
  - Service wired with TypeORM `Contract` entity
- WMS module with endpoints:
  - `POST /asn` to create ASN
  - `POST /receipts` to post receipts
  - `POST /putaway` to execute putaway
  - `POST /picks/waves` to create picking waves
  - `POST /packs` to confirm packing
- Customer Portal module with endpoints:
  - `GET /customer-portal/inventory` to get inventory snapshot
  - `GET /customer-portal/inventory/movements` to get inventory movements
  - `GET /customer-portal/orders` to get customer orders
  - `POST /customer-portal/orders` to create new order
  - `GET /customer-portal/orders/:id` to get order details
  - `GET /customer-portal/shipments` to get customer shipments
  - `GET /customer-portal/shipments/tracking/:trackingNumber` to track shipment
- Mobile Driver App (Flutter) with features:
  - Authentication and login system
  - Route management and delivery tracking
  - Electronic Proof of Delivery (ePOD) with signature capture
  - Photo capture for delivery confirmation
  - Offline-first architecture with sync capabilities
  - Real-time location tracking
  - Multi-language support (English/Arabic)
- 3PL Billing System with features:
  - Rate card management with tiered pricing
  - Unbilled transaction tracking
  - Automated invoice generation
  - Payment processing and tracking
  - Pricing engine with multiple service types
  - Tax calculation and PDF generation
  - Refund processing capabilities
- Complete Backend API with all modules:
  - User Management (CRUD operations)
  - Customer Management (CRUD operations)
  - Item Management (CRUD operations)
  - Warehouse Management (CRUD operations)
  - Inventory Management (CRUD operations)
  - Order Management (CRUD operations)
  - Route Management (CRUD operations)
  - Reporting System (Dashboard, KPIs, Analytics)
  - Notification System (Real-time alerts)

### Technical Details
- **Backend**: NestJS with TypeORM, PostgreSQL, Redis, Bull queues
- **Frontend**: Next.js 14, React 18, Tailwind CSS, TypeScript
- **Database**: PostgreSQL with comprehensive entity relationships
- **Authentication**: JWT with refresh token rotation
- **Styling**: Tailwind CSS with custom theme and Arabic font support
- **State Management**: React Query for server state, React Hook Form for forms
- **Validation**: Zod schemas for type-safe validation
- **Internationalization**: Next.js i18n with Arabic RTL support

### Database Entities Created
1. **User Management**: User, Role, UserRole
2. **Customer Management**: Customer, Contract
3. **Inventory Management**: Item, Lot, Warehouse, Bin, Inventory
4. **Order Management**: Order, OrderLine
5. **Route Management**: Route, RouteStop, EPod
6. **Billing Management**: RateCard, RateCardRule, UnbilledTxn, Invoice, InvoiceLine, Payment

### API Endpoints (Initial)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/change-password` - Change password

### Next Steps
- [ ] Implement contract management and e-signature system
- [ ] Build WMS inbound/outbound operations
- [ ] Create customer portal for inventory management
- [ ] Develop mobile app for drivers with ePOD functionality
- [ ] Implement 3PL billing and invoicing system
- [ ] Create reporting and KPI dashboards
- [ ] Add comprehensive testing suite
- [x] Implement webhook system for integrations
- [ ] Add file upload and document management
- [ ] Create admin dashboard for system management

---

## Arabic Translation / الترجمة العربية

### تمت الإضافة
- **هيكل المشروع**: تم إنشاء هيكل مشروع شامل مع الخلفية (NestJS) والواجهة الأمامية (Next.js)
- **مخطط قاعدة البيانات**: تم تنفيذ مخطط قاعدة بيانات PostgreSQL مع جميع الكيانات الأساسية
- **نظام المصادقة**: مصادقة قائمة على JWT مع تحكم في الوصول قائم على الأدوار
- **البنية التحتية للخلفية**: إعداد تطبيق NestJS مع TypeORM وتوثيق API Swagger
- **البنية التحتية للواجهة الأمامية**: إعداد Next.js 14 مع TypeScript و Tailwind CSS
- **أدوات التطوير**: تكوين ESLint و Prettier و TypeScript

### التفاصيل التقنية
- **الخلفية**: NestJS مع TypeORM و PostgreSQL و Redis
- **الواجهة الأمامية**: Next.js 14 و React 18 و Tailwind CSS
- **قاعدة البيانات**: PostgreSQL مع علاقات شاملة بين الكيانات
- **المصادقة**: JWT مع دوران رمز التحديث
- **التصميم**: Tailwind CSS مع دعم الخط العربي والاتجاه من اليمين إلى اليسار

## [1.0.1] - 2025-09-25

### Added
- WMS: Cycle Count endpoints (`POST /receipts/cycle-count/start`, `POST /receipts/cycle-count/post`).
- WMS: Wave completion endpoint (`POST /picks/waves/complete`) to mark orders PACKED.
- Routes: Stop completion with ePOD (`POST /routes/stops/complete`).
- Webhooks module (controller/service) and Docker Compose setup (Postgres 15 + API).
- OpenAPI export script (`npm run openapi`).
- RBAC: Enforced JWT + RolesGuard on WMS and Routes endpoints.

### Changed
- Billing: Invoice generation now prices using DB `rate_cards` and `rate_card_rules` when available.
- Billing: `UnbilledTxn` now tracks `billed` and `invoiceId` linkage.
- DB: Added migration `1695660000000-add-billed-to-unbilled_txns.ts`.
