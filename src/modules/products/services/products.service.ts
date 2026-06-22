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
import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';
import { RedisService } from 'src/integrations/redis/redis.service';
import { getProductCacheKey } from 'src/common/helpers/product-cache.helper';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const category = await this.categoriesRepository.findById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const slug = slugify(dto.name, { lower: true, strict: true });

    const existing = await this.productsRepository.findBySlug(slug);

    if (existing) {
      throw new BadRequestException('Product already exists');
    }

    let image: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);
      image = upload.url;
      imagePublicId = upload.publicId;
    }

    const payload = {
      name: dto.name,
      slug,
      description: dto.description,
      categoryId: dto.categoryId,
      image,
      imagePublicId,
    };

    return this.productsRepository.create(payload);
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
      filter.isActive = query.isActive;
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
    const cacheKey = getProductCacheKey(id);

    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.redis.set(cacheKey, product, 300);

    return product;
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let image = product.image;
    let imagePublicId = product.imagePublicId;

    if (file) {
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    const updated = await this.productsRepository.update(id, {
      name: dto.name,
      description: dto.description,
      image,
      imagePublicId,
    });

    await this.redis.del(getProductCacheKey(id));

    return updated;
  }

  async remove(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imagePublicId = product.imagePublicId;

    if (imagePublicId) {
      await this.cloudinaryService.deleteImage(imagePublicId);
    }

    const deleted = await this.productsRepository.update(id, {
      isActive: false,
    });

    await this.redis.del(getProductCacheKey(id));

    return deleted;
  }
}
