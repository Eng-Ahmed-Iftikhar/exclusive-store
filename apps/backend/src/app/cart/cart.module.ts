import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRecoveryService } from './cart-recovery.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [PrismaModule, AuthModule, AppConfigModule],
  controllers: [CartController],
  providers: [CartService, CartRecoveryService],
  exports: [CartService, CartRecoveryService],
})
export class CartModule {}
