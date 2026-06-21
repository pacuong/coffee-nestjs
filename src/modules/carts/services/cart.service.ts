import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CartRepository } from '../repositories/cart.repository';
import { CartItemRepository } from '../repositories/cart-item.repository';

import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { Cart, CartItem, ProductVariant } from '@prisma/client';
import { UpdateCartItemDto } from 'src/modules/carts/dto/update-cart-item.dto';
import { ProductVariantsRepository } from 'src/modules/productVariants/repositories/product-variants.repository';

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
    private readonly productVariantsRepository: ProductVariantsRepository,
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
    const variant = await this.productVariantsRepository.findById(
      dto.variantId,
    );

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
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

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.cartItemRepo.findById(itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.cartItemRepo.update(itemId, dto.quantity);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.cartItemRepo.findById(itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.cartItemRepo.delete(itemId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.cartRepo.clearCartItems(cart.id);
  }
}
