import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { CartService } from '../services/cart.service';
import { AddCartItemDto } from '../dto/add-cart-item.dto';

import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: JwtPayload) {
    return this.cartService.getOrCreateCart(user.sub);
  }

  @Post('items')
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.sub, dto);
  }
}
