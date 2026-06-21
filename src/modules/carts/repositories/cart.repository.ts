import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },

      include: {
        items: {
          include: {
            variant: {
              include: {
                recipe: {
                  include: {
                    items: {
                      include: {
                        ingredient: {
                          include: {
                            inventory: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  create(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
    });
  }

  clearCartItems(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
