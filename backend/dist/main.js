"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('3PL Warehouse Management API')
        .setDescription('Comprehensive 3PL Warehouse Management System API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication and Authorization')
        .addTag('customers', 'Customer Management')
        .addTag('contracts', 'Contract Management')
        .addTag('inventory', 'Inventory and WMS Operations')
        .addTag('orders', 'Order Management')
        .addTag('routes', 'Delivery and TMS')
        .addTag('billing', 'Billing and Invoicing')
        .addTag('reports', 'Reporting and Analytics')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map