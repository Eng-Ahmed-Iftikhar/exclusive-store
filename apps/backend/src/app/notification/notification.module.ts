import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationEventService } from './notification-event.service';
import { NotificationListener } from './notification.listener';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfigModule, ConfigService } from '../config';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: configService.jwtExpiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationEventService,
    NotificationListener,
    {
      provide: 'NotificationGateway',
      useExisting: NotificationGateway,
    },
  ],
  exports: [NotificationService, NotificationGateway, NotificationEventService],
})
export class NotificationModule {}
