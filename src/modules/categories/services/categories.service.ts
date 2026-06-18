import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { CategoriesRepository } from '../repositories/categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';

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
}
