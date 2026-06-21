import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },

      include: {
        user: true,

        items: {
          include: {
            variant: true,
          },
        },
      },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
