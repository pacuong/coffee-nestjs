import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, {
      lower: true,
      strict: true,
    });

    const existing = await this.categoriesRepository.findBySlug(slug);

    if (existing) {
      throw new BadRequestException('Category already exists');
    }

    return this.categoriesRepository.create(dto.name, slug);
  }

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
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

    return this.categoriesRepository.update(id, {
      name: dto.name,
      slug,
    });
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoriesRepository.delete(id);
  }
}
