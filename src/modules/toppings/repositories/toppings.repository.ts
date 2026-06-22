import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToppingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ToppingCreateInput) {
    return this.prisma.topping.create({
      data,
    });
  }

  findMany() {
    return this.prisma.topping.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findById(id: string) {
    return this.prisma.topping.findUnique({
      where: {
        id,
      },
    });
  }

  findByName(name: string) {
    return this.prisma.topping.findFirst({
      where: {
        name,
      },
    });
  }

  update(id: string, data: Prisma.ToppingUpdateInput) {
    return this.prisma.topping.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.topping.delete({
      where: {
        id,
      },
    });
  }
}
