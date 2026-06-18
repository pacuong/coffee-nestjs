import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/modules/carts/cart.module';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';

@Module({
  imports: [PrismaModule, CartModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
