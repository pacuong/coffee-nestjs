import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/modules/carts/cart.module';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { SocketModule } from 'src/integrations/socket/socket.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { StatisticsModule } from 'src/modules/statistics/statistics.module';

@Module({
  imports: [
    PrismaModule,
    CartModule,
    SocketModule,
    NotificationsModule,
    StatisticsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
