# 3PL Warehouse Management System

A comprehensive Third-Party Logistics (3PL) warehouse management system built with modern technologies to handle warehouse operations, inventory management, delivery tracking, and automated billing.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Support for multiple warehouse operators
- **Contract Management**: Electronic contract signing and management
- **Inventory Management**: Real-time inventory tracking with lot/serial number support
- **Order Management**: Inbound, outbound, and transfer order processing
- **Delivery Management**: Route planning, driver assignment, and ePOD (electronic proof of delivery)
- **Automated Billing**: 3PL-specific billing with customizable rate cards
- **Customer Portal**: Self-service portal for customers to manage their inventory
- **Mobile App**: Driver/delivery personnel mobile application
- **Reporting & Analytics**: Comprehensive KPI dashboards and reports

### Technical Features
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Updates**: WebSocket support for live updates
- **Multi-language Support**: English and Arabic with RTL support
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Audit Trail**: Complete audit logging for all operations
- **File Management**: Document and image upload/storage
- **Webhook Support**: Integration capabilities with external systems

## 🏗️ Architecture

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis for session management and caching
- **Queue**: Bull for background job processing
- **Authentication**: JWT with refresh token rotation
- **Documentation**: Swagger/OpenAPI

### Frontend (Next.js)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Next.js i18n with Arabic RTL support

### Mobile (Flutter)
- **Framework**: Flutter for cross-platform mobile development
- **Offline Support**: Offline-first architecture with sync capabilities
- **Maps Integration**: Google Maps for route tracking
- **Camera Integration**: Photo capture for ePOD

## 📊 Database Schema

### Core Entities
- **Users & Roles**: User management with role-based permissions
- **Customers & Contracts**: Customer management with electronic contracts
- **Items & Inventory**: Product catalog with lot/serial tracking
- **Warehouses & Bins**: Physical location management
- **Orders & Lines**: Order processing with line items
- **Routes & Stops**: Delivery route management
- **Billing**: Rate cards, invoices, and payment tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 3pl-warehouse-management
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   
   # Update environment variables
   # Edit backend/.env with your database and Redis credentials
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb 3pl_warehouse
   
   # Run migrations (when available)
   cd backend && npm run migration:run
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:backend  # Backend on port 3001
   npm run dev:frontend # Frontend on port 3000
   ```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Admin Panel**: http://localhost:3000/admin
- **Customer Portal**: http://localhost:3000/customer

## 📱 Mobile App Setup

### Prerequisites
- Flutter SDK 3.0+
- Android Studio / Xcode
- Android device or emulator

### Installation
```bash
cd mobile
flutter pub get
flutter run
```

## 🔧 Development

### Code Style
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Line Length**: Maximum 100 characters
- **Components**: Functional components preferred, one export per file
- **Documentation**: JSDoc for exported functions and public APIs

### Project Structure
```
3pl-warehouse-management/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── common/         # Shared utilities and services
│   │   ├── modules/        # Feature modules
│   │   └── database/       # Database entities and migrations
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Next.js pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── package.json
├── mobile/                 # Flutter mobile app
│   ├── lib/
│   │   ├── screens/        # Mobile screens
│   │   ├── widgets/        # Reusable widgets
│   │   └── services/       # API services
│   └── pubspec.yaml
├── docs/                   # Documentation
├── changelog.md            # Project changelog
└── README.md
```

### Available Scripts

#### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

#### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run pending migrations

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test          # Jest tests
npm run test:watch    # Watch mode
```

## 📦 Deployment

### Backend Deployment
1. Build the application
   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables
3. Deploy to your preferred platform (Docker, AWS, etc.)

### Frontend Deployment
1. Build the application
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `.next` folder to your hosting platform

### Mobile App Deployment
```bash
cd mobile
flutter build apk --release  # Android
flutter build ios --release # iOS
```

## 🔐 Security

- **Authentication**: JWT tokens with refresh rotation
- **Authorization**: Role-based access control
- **Data Encryption**: TLS in transit, encryption at rest
- **Input Validation**: Comprehensive input sanitization
- **Audit Logging**: Complete operation tracking
- **Rate Limiting**: API rate limiting protection

## 🌐 Internationalization

The system supports multiple languages:
- **English** (LTR)
- **Arabic** (RTL)

Language files are located in:
- Frontend: `frontend/public/locales/`
- Backend: `backend/src/i18n/`

## 📈 Monitoring & Analytics

- **Application Monitoring**: Built-in health checks
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Comprehensive error logging
- **Business Metrics**: KPI dashboards and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email**: support@3pl-warehouse.com
- **Documentation**: [docs.3pl-warehouse.com](https://docs.3pl-warehouse.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/3pl-warehouse-management/issues)

## 🗺️ Roadmap

### Phase 1 (MVP) - Completed ✅
- [x] Project setup and architecture
- [x] Database schema implementation
- [x] Authentication system
- [x] Basic API structure

### Phase 2 (Core Features) - In Progress 🚧
- [ ] Contract management and e-signature
- [ ] WMS inbound/outbound operations
- [ ] Customer portal
- [ ] Mobile driver app
- [ ] Billing system

### Phase 3 (Advanced Features) - Planned 📋
- [ ] Advanced reporting and analytics
- [ ] Integration APIs
- [ ] Machine learning for optimization
- [ ] Multi-region support

---

## Arabic Translation / الترجمة العربية

# نظام إدارة المستودعات 3PL

نظام شامل لإدارة المستودعات والخدمات اللوجستية من الطرف الثالث مبني بتقنيات حديثة للتعامل مع عمليات المستودعات وإدارة المخزون وتتبع التسليم والفوترة الآلية.

## المميزات الرئيسية

### الوظائف الأساسية
- **معمارية متعددة المستأجرين**: دعم لعدة مشغلين للمستودعات
- **إدارة العقود**: التوقيع الإلكتروني وإدارة العقود
- **إدارة المخزون**: تتبع المخزون في الوقت الفعلي مع دعم أرقام اللوط والتسلسل
- **إدارة الطلبات**: معالجة طلبات الوارد والصادر والنقل
- **إدارة التسليم**: تخطيط المسارات وتعيين السائقين وإثبات التسليم الإلكتروني
- **الفوترة الآلية**: فوترة مخصصة لـ 3PL مع كروت أسعار قابلة للتخصيص
- **بوابة العملاء**: بوابة الخدمة الذاتية للعملاء لإدارة مخزونهم
- **تطبيق الهاتف المحمول**: تطبيق الهاتف المحمول لسائقي التوصيل
- **التقارير والتحليلات**: لوحات مؤشرات الأداء والتقارير الشاملة

### المميزات التقنية
- **المصادقة والتفويض**: مصادقة قائمة على JWT مع تحكم في الوصول قائم على الأدوار
- **التحديثات في الوقت الفعلي**: دعم WebSocket للتحديثات المباشرة
- **دعم متعدد اللغات**: الإنجليزية والعربية مع دعم الاتجاه من اليمين إلى اليسار
- **توثيق API**: توثيق شامل Swagger/OpenAPI
- **مسار التدقيق**: تسجيل تدقيق كامل لجميع العمليات
- **إدارة الملفات**: رفع وتخزين المستندات والصور
- **دعم Webhook**: قدرات التكامل مع الأنظمة الخارجية

## البنية المعمارية

### الخلفية (NestJS)
- **الإطار**: NestJS مع TypeScript
- **قاعدة البيانات**: PostgreSQL مع TypeORM
- **التخزين المؤقت**: Redis لإدارة الجلسات والتخزين المؤقت
- **الطابور**: Bull لمعالجة المهام في الخلفية
- **المصادقة**: JWT مع دوران رمز التحديث
- **التوثيق**: Swagger/OpenAPI

### الواجهة الأمامية (Next.js)
- **الإطار**: Next.js 14 مع React 18
- **التصميم**: Tailwind CSS مع موضوع مخصص
- **إدارة الحالة**: React Query لحالة الخادم
- **النماذج**: React Hook Form مع التحقق من Zod
- **الترجمة**: Next.js i18n مع دعم العربية RTL

### الهاتف المحمول (Flutter)
- **الإطار**: Flutter لتطوير الهاتف المحمول عبر المنصات
- **دعم عدم الاتصال**: معمارية عدم الاتصال أولاً مع قدرات المزامنة
- **تكامل الخرائط**: خرائط Google لتتبع المسارات
- **تكامل الكاميرا**: التقاط الصور لإثبات التسليم الإلكتروني

---

**تم تطوير هذا النظام بواسطة هيثم علامكي**  
**This system was developed by Haitham Alamki**
