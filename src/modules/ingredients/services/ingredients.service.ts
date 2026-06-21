import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IngredientsRepository } from '../repositories/ingredients.repository';

import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly ingredientRepo: IngredientsRepository) {}

  async create(dto: CreateIngredientDto) {
    const existing = await this.ingredientRepo.findByName(dto.name);

    if (existing) {
      throw new BadRequestException('Ingredient already exists');
    }

    return this.ingredientRepo.create(dto);
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

  async update(id: string, dto: UpdateIngredientDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.ingredientRepo.findByName(dto.name);

      if (existing && existing.id !== id) {
        throw new BadRequestException('Ingredient already exists');
      }
    }

    return this.ingredientRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.ingredientRepo.delete(id);
  }
}
