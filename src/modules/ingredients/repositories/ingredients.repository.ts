import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IngredientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.IngredientCreateInput) {
    return this.prisma.ingredient.create({
      data,
    });
  }

  findMany() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.ingredient.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.IngredientUpdateInput) {
    return this.prisma.ingredient.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.ingredient.delete({
      where: { id },
    });
  }
}
