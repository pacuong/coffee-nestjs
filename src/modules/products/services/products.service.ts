import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import slugify from 'slugify';

import { ProductsRepository } from '../repositories/products.repository';
import { CategoriesRepository } from '../../categories/repositories/categories.repository';

import { CreateProductDto } from '../dto/create-product.dto';
import { QueryProductDto } from '../dto/query-product.dto';
import { Prisma } from '@prisma/client';
import { UpdateProductDto } from 'src/modules/products/dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,

    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoriesRepository.findById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });

    const existing = await this.productsRepository.findBySlug(slug);

    if (existing) {
      throw new BadRequestException('Product already exists');
    }

    return this.productsRepository.create({
      name: dto.name,
      slug,
      description: dto.description,
      categoryId: dto.categoryId,
    });
  }

  async findAll(query: QueryProductDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const filter: Prisma.ProductWhereInput = {};

    if (query.search) {
      filter.name = {
        contains: query.search,
      };
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === 'true';
    }

    const [data, total] = await Promise.all([
      this.productsRepository.findAll(filter, skip, limit),
      this.productsRepository.count(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productsRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });
  }

  async remove(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productsRepository.update(id, {
      isActive: false,
    });
  }
}
