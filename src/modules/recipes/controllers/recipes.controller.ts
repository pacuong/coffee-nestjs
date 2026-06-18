import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { RecipesService } from '../services/recipes.service';

import { CreateRecipeDto } from '../dto/create-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':variantId')
  findOne(
    @Param('variantId')
    variantId: string,
  ) {
    return this.recipesService.findOneByVariant(variantId);
  }
}
