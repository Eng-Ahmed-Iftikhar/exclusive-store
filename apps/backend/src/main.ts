/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLoggerService } from './app/logger/logger.service';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';
import { HttpLoggerInterceptor } from './app/interceptors/http-logger.interceptor';
import { ConfigService } from './app/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get config service
  const configService = app.get(ConfigService);

  // Get logger service
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Global HTTP logger interceptor
  app.useGlobalInterceptors(new HttpLoggerInterceptor(logger));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Enable CORS for frontend connection
  app.enableCors({
    origin: [
      configService.frontendUrl,
      'http://localhost:4200',
      'http://localhost:5173',
      'http://localhost:5473',
    ],
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Exclusive API')
    .setDescription(
      `
      The Exclusive application API documentation.
      
      ## Features
      - **Authentication**: JWT-based authentication with role-based access control
      - **File Management**: Cloudinary integration for file upload, transformation, and management
      - **Category Management**: Product categories and subcategories
      - **Item Management**: Product/Item CRUD operations
      - **Order Management**: Order processing and management
      - **Team Management**: Team creation and member management
      - **Role-Based Access Control**: Granular permissions system
      - **Activity Tracking**: User activity logging and monitoring
      
      ## Authentication
      Most endpoints require authentication. Use the "Authorize" button to set your JWT token.
      
      ## File Management
      The file management system supports:
      - Image, video, document, and audio file uploads
      - Automatic optimization and transformation
      - Folder and tag-based organization
      - Bulk operations
      - Cloudinary integration for CDN delivery
    `
    )
    .setVersion('1.0')
    .setContact(
      'Exclusive Team',
      'https://exclusive.com',
      'support@exclusive.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${configService.port}`, 'Development Server')
    .addServer('https://api.exclusive.com/api', 'Production Server')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Admin', 'Admin management endpoints')
    .addTag('Files', 'File management endpoints')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Items', 'Item/Product management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Favorites', 'Favorites management endpoints')
    .addTag('FlashSales', 'Flash sales management endpoints')
    .addTag('Teams', 'Team management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .addTag('Permissions', 'Permission management endpoints')
    .addTag('Resources', 'Resource management endpoints')
    .addTag('Activity', 'Activity tracking endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'Exclusive API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });

  const port = configService.port;
  await app.listen(port);

  // Use custom logger for startup messages
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    'Bootstrap'
  );
  logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/docs`,
    'Bootstrap'
  );
  logger.log(`Environment: ${configService.nodeEnv}`, 'Bootstrap');
}

bootstrap();
