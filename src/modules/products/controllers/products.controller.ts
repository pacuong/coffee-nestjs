import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsService } from '../services/products.service';

import { CreateProductDto } from '../dto/create-product.dto';
import { QueryProductDto } from 'src/modules/products/dto/query-product.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from 'src/modules/products/dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(dto, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
