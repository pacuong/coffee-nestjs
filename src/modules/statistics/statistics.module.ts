import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { StatisticsController } from './controllers/statistics.controller';

import { StatisticsRepository } from './repositories/statistics.repository';

import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [PrismaModule],

  controllers: [StatisticsController],

  providers: [StatisticsService, StatisticsRepository],
})
export class StatisticsModule {}
