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

import { CategoriesService } from '../services/categories.service';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from 'src/modules/categories/dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoriesService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
