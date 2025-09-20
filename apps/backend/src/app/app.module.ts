import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { EmailModule } from './email/email.module';
import { FavoritesModule } from './favorites/favorites.module';
import { FlashSalesModule } from './flash-sales/flash-sales.module';
import { ItemsModule } from './items/items.module';
import { LoggerModule } from './logger/logger.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SearchModule } from './search/search.module';
import { RbacModule } from './rbac/rbac.module';
import { TeamsModule } from './teams/teams.module';
import { ResourcesModule } from './resources/resources.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ActivityModule } from './activity/activity.module';
import { FilesModule } from './files/files.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    AppConfigModule,
    LoggerModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    AdminModule,
    CategoryModule,
    ItemsModule,
    CartModule,
    FavoritesModule,
    FlashSalesModule,
    OrdersModule,
    EmailModule,
    SearchModule,
    RbacModule,
    TeamsModule,
    ResourcesModule,
    RolesModule,
    PermissionsModule,
    ActivityModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
