import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';

import { OrdersService } from '../services/orders.service';

import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload) {
    return this.ordersService.createOrder(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOrder(id);
  }
}
