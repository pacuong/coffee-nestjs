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

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly cloudinaryService: CloudinaryService,
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

    return this.categoriesRepository.create({
      name: dto.name,
      slug,
      image,
      imagePublicId,
    });
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

    return this.categoriesRepository.update(id, {
      name: dto.name,
      slug,
      image,
      imagePublicId,
    });
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.imagePublicId) {
      await this.cloudinaryService.deleteImage(category.imagePublicId);
    }

    return this.categoriesRepository.delete(id);
  }
}
