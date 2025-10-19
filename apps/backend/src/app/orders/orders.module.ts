import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AdminOrdersController } from './admin-orders.controller';
import { AdminOrdersService } from './admin-orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { AppConfigModule } from '../config/config.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    CartModule,
    AuthModule,
    EmailModule,
    ActivityModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, AdminOrdersService],
  exports: [OrdersService, AdminOrdersService],
})
export class OrdersModule {}
