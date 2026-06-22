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
import { ProductVariantsService } from 'src/modules/productVariants/services/product-variants.service';
import { PrismaService } from 'src/prisma/prisma.service';

type CartFull = Cart & {
  items: (CartItem & {
    variant: ProductVariant;
  })[];
};

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productVariantService: ProductVariantsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartFull> {
    let cart = await this.cartRepo.findByUserId(userId);

    if (!cart) {
      try {
        await this.cartRepo.create(userId);
      } catch (e) {
        console.log('Create cart error:', e);
      }

      cart = await this.cartRepo.findByUserId(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or retrieve cart');
    }

    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const variant = await this.productVariantService.findOne(dto.variantId);

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

      await this.cartItemRepo.update(existingItem.id, quantity);

      if (dto.toppings?.length) {
        await this.prisma.cartItemTopping.deleteMany({
          where: { cartItemId: existingItem.id },
        });

        await this.prisma.cartItemTopping.createMany({
          data: dto.toppings.map((t) => ({
            cartItemId: existingItem.id,
            toppingId: t.toppingId,
            quantity: t.quantity,
          })),
        });
      }

      return this.cartItemRepo.findById(existingItem.id);
    }

    const cartItem = await this.cartItemRepo.create(
      cart.id,
      dto.variantId,
      dto.quantity,
    );

    if (dto.toppings?.length) {
      await this.prisma.cartItemTopping.createMany({
        data: dto.toppings.map((t) => ({
          cartItemId: cartItem.id,
          toppingId: t.toppingId,
          quantity: t.quantity,
        })),
      });
    }

    return cartItem;
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.cartItemRepo.findById(itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // update quantity
    await this.cartItemRepo.update(itemId, dto.quantity);

    // optional: giữ nguyên toppings (KHÔNG xóa)

    return this.cartItemRepo.findById(itemId);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.cartItemRepo.findById(itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // 🔥 DELETE TOPPINGS FIRST
    await this.prisma.cartItemTopping.deleteMany({
      where: { cartItemId: itemId },
    });

    return this.cartItemRepo.delete(itemId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    return this.cartRepo.clearCartItems(cart.id);
  }
}
