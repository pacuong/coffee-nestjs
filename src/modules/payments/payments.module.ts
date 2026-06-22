import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from 'src/prisma/prisma.module';

import { OrdersModule } from '../orders/orders.module';

import { PaymentsController } from './controllers/payments.controller';

import { PaymentsRepository } from './repositories/payments.repository';

import { PaymentsService } from './services/payments.service';
import { MomoService } from './services/momo.service';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';

@Module({
  imports: [PrismaModule, ConfigModule, OrdersModule, StatisticsModule],

  controllers: [PaymentsController],

  providers: [PaymentsService, PaymentsRepository, MomoService],
})
export class PaymentsModule {}
