import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { ProductsService } from '../services/products.service';

import { CreateProductDto } from '../dto/create-product.dto';
import { QueryProductDto } from 'src/modules/products/dto/query-product.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }
}
