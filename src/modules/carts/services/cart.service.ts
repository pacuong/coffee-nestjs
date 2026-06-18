import { Injectable } from '@nestjs/common';

import { CartRepository } from '../repositories/cart.repository';
import { CartItemRepository } from '../repositories/cart-item.repository';

import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { Cart, CartItem, ProductVariant } from '@prisma/client';

type CartFull = Cart & {
  items: (CartItem & {
    variant: ProductVariant;
  })[];
};

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartFull> {
    let cart = await this.cartRepo.findByUserId(userId);

    if (!cart) {
      await this.cartRepo.create(userId);
      cart = await this.cartRepo.findByUserId(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or retrieve cart');
    }

    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.cartItemRepo.findItem(
      cart.id,
      dto.variantId,
    );

    if (existingItem) {
      const quantity = Number(existingItem.quantity) + Number(dto.quantity);

      return this.cartItemRepo.update(existingItem.id, quantity);
    }

    return this.cartItemRepo.create(cart.id, dto.variantId, dto.quantity);
  }
}
