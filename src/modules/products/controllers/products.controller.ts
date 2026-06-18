import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ProductsService } from '../services/products.service';

import { CreateProductDto } from '../dto/create-product.dto';
import { QueryProductDto } from 'src/modules/products/dto/query-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }
}
