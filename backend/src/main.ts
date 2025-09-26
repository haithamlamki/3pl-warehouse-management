import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
