import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [PrismaModule, AuthModule, SubcategoryModule, ActivityModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
