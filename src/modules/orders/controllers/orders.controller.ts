import { Controller, Post, Get, Param, UseGuards, Body } from '@nestjs/common';

import { OrdersService } from '../services/orders.service';

import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('Orders')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.sub, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.ordersService.findOrder(user.sub, id);
  }

  @Get()
  findMyOrders(@CurrentUser() user: JwtPayload) {
    return this.ordersService.findMyOrders(user.sub);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }
}
