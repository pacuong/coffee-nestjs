import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IngredientsRepository } from '../repositories/ingredients.repository';

import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';

@Injectable()
export class IngredientsService {
  constructor(
    private readonly ingredientRepo: IngredientsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateIngredientDto, file?: Express.Multer.File) {
    const existing = await this.ingredientRepo.findByName(dto.name);

    if (existing) {
      throw new BadRequestException('Ingredient already exists');
    }

    let image: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    return this.ingredientRepo.create({
      name: dto.name,
      unit: dto.unit,
      image,
      imagePublicId,
    });
  }

  findAll() {
    return this.ingredientRepo.findMany();
  }

  async findOne(id: string) {
    const ingredient = await this.ingredientRepo.findById(id);

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    return ingredient;
  }

  async update(
    id: string,
    dto: UpdateIngredientDto,
    file?: Express.Multer.File,
  ) {
    const ingredient = await this.findOne(id);

    if (dto.name) {
      const existing = await this.ingredientRepo.findByName(dto.name);

      if (existing && existing.id !== id) {
        throw new BadRequestException('Ingredient already exists');
      }
    }

    let image = ingredient.image;
    let imagePublicId = ingredient.imagePublicId;

    if (file) {
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    return this.ingredientRepo.update(id, {
      name: dto.name,
      unit: dto.unit,
      image,
      imagePublicId,
    });
  }

  async remove(id: string) {
    const ingredient = await this.findOne(id);

    if (ingredient.imagePublicId) {
      await this.cloudinaryService.deleteImage(ingredient.imagePublicId);
    }

    return this.ingredientRepo.delete(id);
  }
}
