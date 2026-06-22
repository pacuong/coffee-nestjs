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
import { RedisService } from 'src/integrations/redis/redis.service';
import { getCartCacheKey } from 'src/common/helpers/cart-cache.helper';

type CartFull = Cart & {
  items: (CartItem & {
    variant: ProductVariant;
  })[];
};

@Injectable()
export class CartService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productVariantService: ProductVariantsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<CartFull> {
    const cacheKey = getCartCacheKey(userId);

    const cached = await this.redis.get<CartFull>(cacheKey);
    if (cached) return cached;

    let cart = await this.cartRepo.findByUserId(userId);

    if (!cart) {
      await this.cartRepo.create(userId);
      cart = await this.cartRepo.findByUserId(userId);
    }

    if (!cart) {
      throw new Error('Failed to create or retrieve cart');
    }

    await this.invalidateCart(userId);

    const freshCart = await this.cartRepo.findByUserId(userId);

    if (!freshCart) {
      throw new Error('Cart not found');
    }

    await this.redis.set(getCartCacheKey(userId), freshCart, 300);

    return freshCart;
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

      const result = await this.cartItemRepo.findById(existingItem.id);

      await this.invalidateCart(userId);

      return result;
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

    await this.invalidateCart(userId);

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

    const result = await this.cartItemRepo.findById(itemId);

    await this.invalidateCart(userId);

    return result;
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

    const result = await this.cartItemRepo.delete(itemId);

    await this.invalidateCart(userId);

    return result;
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const result = await this.cartRepo.clearCartItems(cart.id);

    await this.invalidateCart(userId);

    return result;
  }

  private async invalidateCart(userId: string) {
    await this.redis.del(getCartCacheKey(userId));
  }
}
