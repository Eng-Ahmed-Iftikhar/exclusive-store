import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityGateway } from './activity.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityGateway],
  exports: [ActivityService],
})
export class ActivityModule {}
