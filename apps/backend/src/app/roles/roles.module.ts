import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleSelfModificationGuard } from '../auth/guards/role-self-modification.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, ActivityModule, AuthModule],
  controllers: [RolesController],
  providers: [RolesService, RoleSelfModificationGuard],
  exports: [RolesService],
})
export class RolesModule {}
