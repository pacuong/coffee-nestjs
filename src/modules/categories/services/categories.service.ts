import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';
import { RedisService } from 'src/integrations/redis/redis.service';
import {
  CATEGORY_LIST_CACHE_KEY,
  getCategoryCacheKey,
} from 'src/common/helpers/category-cache.helper';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateCategoryDto, file?: Express.Multer.File) {
    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });

    const existing = await this.categoriesRepository.findBySlug(slug);

    if (existing) {
      throw new BadRequestException('Category already exists');
    }

    let image: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    const category = await this.categoriesRepository.create({
      name: dto.name,
      slug,
      image,
      imagePublicId,
    });

    await this.redis.del(CATEGORY_LIST_CACHE_KEY);

    return category;
  }

  async findAll() {
    const cached = await this.redis.get(CATEGORY_LIST_CACHE_KEY);

    if (cached) {
      return cached;
    }

    const categories = await this.categoriesRepository.findAll();

    await this.redis.set(CATEGORY_LIST_CACHE_KEY, categories, 600);

    return categories;
  }

  async findOne(id: string) {
    const cacheKey = getCategoryCacheKey(id);

    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return cached;
    }

    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.redis.set(cacheKey, category, 600);

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let image = category.image;
    let imagePublicId = category.imagePublicId;

    if (file) {
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    let slug: string | undefined;

    if (dto.name) {
      slug = slugify(dto.name, {
        lower: true,
        strict: true,
      });

      const existing = await this.categoriesRepository.findBySlug(slug);

      if (existing && existing.id !== id) {
        throw new BadRequestException('Category already exists');
      }
    }

    const updated = await this.categoriesRepository.update(id, {
      name: dto.name,
      slug,
      image,
      imagePublicId,
    });

    await Promise.all([
      this.redis.del(CATEGORY_LIST_CACHE_KEY),
      this.redis.del(getCategoryCacheKey(id)),
    ]);

    return updated;
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.imagePublicId) {
      await this.cloudinaryService.deleteImage(category.imagePublicId);
    }

    const deleted = await this.categoriesRepository.delete(id);

    await Promise.all([
      this.redis.del(CATEGORY_LIST_CACHE_KEY),
      this.redis.del(getCategoryCacheKey(id)),
    ]);

    return deleted;
  }
}
