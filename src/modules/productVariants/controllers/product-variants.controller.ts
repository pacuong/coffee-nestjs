import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';

import { ProductVariantsService } from '../services/product-variants.service';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../dto/update-product-variant.dto';
import { ProductVariant } from '@prisma/client';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly service: ProductVariantsService) {}

  @Post()
  create(@Body() dto: CreateProductVariantDto) {
    return this.service.create(dto);
  }

  @Get(':productId')
  findByProduct(
    @Param('productId') productId: string,
  ): Promise<ProductVariant[]> {
    return this.service.findByProduct(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
