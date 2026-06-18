import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.InventoryCreateInput) {
    return this.prisma.inventory.create({
      data,
      include: {
        ingredient: true,
      },
    });
  }

  findMany() {
    return this.prisma.inventory.findMany({
      include: {
        ingredient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        ingredient: true,
      },
    });
  }

  findByIngredientId(ingredientId: string) {
    return this.prisma.inventory.findUnique({
      where: {
        ingredientId,
      },
    });
  }

  update(id: string, data: Prisma.InventoryUpdateInput) {
    return this.prisma.inventory.update({
      where: { id },
      data,
      include: {
        ingredient: true,
      },
    });
  }
}
