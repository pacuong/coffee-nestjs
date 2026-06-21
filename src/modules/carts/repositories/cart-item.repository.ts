import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });
  }

  findItem(cartId: string, variantId: string) {
    return this.prisma.cartItem.findFirst({
      where: { cartId, variantId },
    });
  }

  create(cartId: string, variantId: string, quantity: number) {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
      },
    });
  }

  update(id: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  delete(id: string) {
    return this.prisma.cartItem.delete({
      where: { id },
    });
  }
}
