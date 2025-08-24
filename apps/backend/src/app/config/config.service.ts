import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentConfig } from './env.config';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}
  // Server Configuration
  get nodeEnv(): string {
    return this.nestConfigService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.nestConfigService.get<number>('PORT', 3000);
  }

  // Database Configuration
  get databaseUrl(): string {
    return this.nestConfigService.get<string>('DATABASE_URL') as string;
  }

  // JWT Configuration
  get jwtSecret(): string {
    return this.nestConfigService.get<string>('JWT_SECRET') as string;
  }

  get jwtExpiresIn(): string {
    return this.nestConfigService.get<string>('JWT_EXPIRES_IN', '15m');
  }

  // Redis Configuration
  get redisUrl(): string {
    return this.nestConfigService.get<string>('REDIS_URL') as string;
  }

  // Email Configuration
  get emailProvider(): string {
    return this.nestConfigService.get<string>('EMAIL_PROVIDER', 'custom');
  }

  get emailHost(): string {
    return this.nestConfigService.get<string>(
      'EMAIL_HOST',
      'smtp.ethereal.email'
    );
  }

  get emailPort(): number {
    return this.nestConfigService.get<number>('EMAIL_PORT', 587);
  }

  get emailSecure(): boolean {
    return this.nestConfigService.get<boolean>('EMAIL_SECURE', false);
  }

  get emailUser(): string | undefined {
    return this.nestConfigService.get<string>('EMAIL_USER');
  }

  get emailPass(): string | undefined {
    return this.nestConfigService.get<string>('EMAIL_PASS');
  }

  get emailFrom(): string {
    return this.nestConfigService.get<string>(
      'EMAIL_FROM',
      'noreply@exclusive.com'
    );
  }

  // Stripe Configuration
  get stripeSecretKey(): string {
    return this.nestConfigService.get<string>('STRIPE_SECRET_KEY') as string;
  }

  // Shipping and Tax Configuration
  get shippingCost(): number {
    return this.nestConfigService.get<number>('SHIPPING_COST', 5.99);
  }

  get freeShippingThreshold(): number {
    return this.nestConfigService.get<number>('FREE_SHIPPING_THRESHOLD', 50);
  }

  get taxRate(): number {
    return this.nestConfigService.get<number>('TAX_RATE', 0.085); // 8.5%
  }

  // Frontend Configuration
  get frontendUrl(): string {
    return this.nestConfigService.get<string>('FRONTEND_URL') as string;
  }

  // Logging Configuration
  get logLevel(): string {
    return this.nestConfigService.get<string>('LOG_LEVEL', 'info');
  }

  get logToFile(): boolean {
    return this.nestConfigService.get<boolean>('LOG_TO_FILE', false);
  }

  get logDir(): string {
    return this.nestConfigService.get<string>('LOG_DIR', './logs');
  }

  // Utility methods
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Get all config (useful for debugging)
  getAll(): EnvironmentConfig {
    return {
      NODE_ENV: this.nodeEnv,
      PORT: this.port,
      DATABASE_URL: this.databaseUrl,
      JWT_SECRET: this.jwtSecret,
      JWT_EXPIRES_IN: this.jwtExpiresIn,
      REDIS_URL: this.redisUrl,
      EMAIL_PROVIDER: this.emailProvider,
      EMAIL_HOST: this.emailHost,
      EMAIL_PORT: this.emailPort,
      EMAIL_SECURE: this.emailSecure,
      EMAIL_USER: this.emailUser,
      EMAIL_PASS: this.emailPass,
      EMAIL_FROM: this.emailFrom,
      STRIPE_SECRET_KEY: this.stripeSecretKey,
      SHIPPING_COST: this.shippingCost,
      FREE_SHIPPING_THRESHOLD: this.freeShippingThreshold,
      TAX_RATE: this.taxRate,
      FRONTEND_URL: this.frontendUrl,
      LOG_LEVEL: this.logLevel,
      LOG_TO_FILE: this.logToFile,
      LOG_DIR: this.logDir,
    };
  }
}
