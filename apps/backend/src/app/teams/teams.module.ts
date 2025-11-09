import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [PrismaModule, RedisModule, EmailModule, AuthModule, ActivityModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
