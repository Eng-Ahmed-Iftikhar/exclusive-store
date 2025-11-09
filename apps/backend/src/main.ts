import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from './app/app.module';
import { CustomLoggerService } from './app/logger/logger.service';
import { GlobalExceptionFilter } from './app/filters/global-exception.filter';
import { HttpLoggerInterceptor } from './app/interceptors/http-logger.interceptor';
import { ConfigService } from './app/config/config.service';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Get config + logger
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);

  // Global filters, pipes, interceptors
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new HttpLoggerInterceptor(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS
  app.enableCors({
    origin: [
      configService.frontendUrl,
      'http://localhost:4200',
      'http://localhost:5173',
      'http://localhost:5473',
    ],
    credentials: true,
  });

  // Prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Exclusive API')
    .setDescription('Exclusive API documentation.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.init();
}

// Initialize Nest app once on cold start
bootstrap();

/**
 * Vercel serverless handler
 * Vercel calls this export for each HTTP request
 */
export default function handler(req: Request, res: Response) {
  server(req, res);
}
