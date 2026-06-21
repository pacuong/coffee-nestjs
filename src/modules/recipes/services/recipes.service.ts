import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RecipesRepository } from '../repositories/recipes.repository';

import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepo: RecipesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateRecipeDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: {
        id: dto.variantId,
      },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const existingRecipe = await this.recipeRepo.findByVariantId(dto.variantId);

    if (existingRecipe) {
      throw new ConflictException('Recipe already exists');
    }

    return this.recipeRepo.createRecipe(dto);
  }

  findAll() {
    return this.recipeRepo.findAll();
  }

  async findOneByVariant(variantId: string) {
    const recipe = await this.recipeRepo.findByVariantId(variantId);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  async remove(variantId: string) {
    await this.findOneByVariant(variantId);

    return this.recipeRepo.delete(variantId);
  }
}
