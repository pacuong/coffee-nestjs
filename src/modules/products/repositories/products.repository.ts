import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    image?: string;
    imagePublicId?: string;
  }) {
    return this.prisma.product.create({
      data,
    });
  }

  findAll(filter: Prisma.ProductWhereInput, skip: number, take: number) {
    return this.prisma.product.findMany({
      where: filter,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  count(filter: Prisma.ProductWhereInput) {
    return this.prisma.product.count({
      where: filter,
    });
  }

  findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: {
        slug,
      },
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        imagePublicId: true,
        isActive: true,
        categoryId: true,
      },
    });
  }

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
