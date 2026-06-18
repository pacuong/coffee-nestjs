import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, ProductVariant } from '@prisma/client';

import { ProductVariantsRepository } from '../repositories/product-variants.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';

import { CreateProductVariantDto } from '../dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    private readonly variantRepo: ProductVariantsRepository,
    private readonly productRepo: ProductsRepository,
  ) {}

  async create(dto: CreateProductVariantDto) {
    const product = await this.productRepo.findById(dto.productId);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return this.variantRepo.create({
      product: {
        connect: { id: dto.productId },
      },
      name: dto.name,
      price: new Prisma.Decimal(dto.price),
    });
  }

  update(id: string, dto: UpdateProductVariantDto) {
    return this.variantRepo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(dto.price !== undefined && {
        price: new Prisma.Decimal(dto.price),
      }),
    });
  }

  findByProduct(productId: string): Promise<ProductVariant[]> {
    return this.variantRepo.findByProductId(productId);
  }

  delete(id: string) {
    return this.variantRepo.delete(id);
  }
}
