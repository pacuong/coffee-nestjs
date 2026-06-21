import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRecipe(data: {
    variantId: string;
    items: {
      ingredientId: string;
      quantity: number;
    }[];
  }) {
    return this.prisma.recipe.create({
      data: {
        variant: {
          connect: {
            id: data.variantId,
          },
        },

        items: {
          create: data.items.map((item) => ({
            ingredient: {
              connect: {
                id: item.ingredientId,
              },
            },
            quantity: item.quantity,
          })),
        },
      },

      include: {
        items: {
          include: {
            ingredient: true,
          },
        },

        variant: true,
      },
    });
  }

  findAll() {
    return this.prisma.recipe.findMany({
      include: {
        variant: true,

        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });
  }

  findByVariantId(variantId: string) {
    return this.prisma.recipe.findUnique({
      where: {
        variantId,
      },

      include: {
        items: {
          include: {
            ingredient: true,
          },
        },

        variant: true,
      },
    });
  }

  delete(variantId: string) {
    return this.prisma.recipe.delete({
      where: {
        variantId,
      },
    });
  }
}
