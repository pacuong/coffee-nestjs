import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { IngredientsService } from '../services/ingredients.service';

import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Ingredients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create ingredient',
  })
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateIngredientDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.ingredientsService.create(dto, file);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all ingredients',
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get ingredient by id',
  })
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update ingredient',
  })
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.ingredientsService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete ingredient',
  })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
