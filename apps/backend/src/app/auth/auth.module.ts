import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigModule, ConfigService } from '../config';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from '../email/email.module';
import { LoggerModule } from '../logger/logger.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOAuthService } from './services/google-oauth.service';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AccessControlService } from './services/access-control.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    AppConfigModule,
    PassportModule,
    PrismaModule,
    RedisModule,
    EmailModule,
    LoggerModule,
    ActivityModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: configService.jwtExpiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleOAuthService,
    RolesGuard,
    PermissionsGuard,
    AccessControlService,
  ],
  exports: [AuthService, AccessControlService],
})
export class AuthModule {}
