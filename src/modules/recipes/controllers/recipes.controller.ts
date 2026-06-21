import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RecipesService } from '../services/recipes.service';

import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create recipe',
  })
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all recipes',
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':variantId')
  @ApiOperation({
    summary: 'Get recipe by variant',
  })
  @Roles(Role.ADMIN)
  findOne(
    @Param('variantId')
    variantId: string,
  ) {
    return this.recipesService.findOneByVariant(variantId);
  }

  @Delete(':variantId')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete recipe',
  })
  remove(@Param('variantId') variantId: string) {
    return this.recipesService.remove(variantId);
  }
}
