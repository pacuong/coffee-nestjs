import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { StatisticsController } from './controllers/statistics.controller';

import { StatisticsRepository } from './repositories/statistics.repository';

import { StatisticsService } from './services/statistics.service';
import { SocketModule } from 'src/integrations/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
  exports: [StatisticsService],
})
export class StatisticsModule {}
