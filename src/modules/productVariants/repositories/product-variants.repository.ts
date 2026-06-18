import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductVariantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ProductVariantCreateInput) {
    return this.prisma.productVariant.create({ data });
  }

  findByProductId(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
    });
  }

  findById(id: string) {
    return this.prisma.productVariant.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.ProductVariantUpdateInput) {
    return this.prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }
}
