import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLoggerService } from './app/logger/logger.service';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';
import { HttpLoggerInterceptor } from './app/interceptors/http-logger.interceptor';
import { ConfigService } from './app/config/config.service';
import express from 'express';

const server = express();
let cachedApp;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

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
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ],
    credentials: true,
  });

  // Set global prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Setup Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Exclusive API')
    .setDescription('The Exclusive E-commerce API documentation')
    .setVersion('1.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Categories', 'Category management endpoints')
    .addTag('Subcategories', 'Subcategory management endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Favorites', 'Favorites management endpoints')
    .addTag('Files', 'File upload and management endpoints')
    .addTag('Transactions', 'Transaction management endpoints')
    .addTag('Notifications', 'Notification management endpoints')
    .addTag('Search', 'Search endpoints')
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

  await app.init();
  cachedApp = app;
  return app;
}

// Serverless function handler for Vercel
module.exports = async (req, res) => {
  await createApp();
  server(req, res);
};

module.exports.default = module.exports;
