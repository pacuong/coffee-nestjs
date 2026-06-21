import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ProductVariantsService } from '../services/product-variants.service';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../dto/update-product-variant.dto';
import { ProductVariant, Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly service: ProductVariantsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create product variant',
  })
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductVariantDto) {
    return this.service.create(dto);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get variants by product',
  })
  findByProduct(
    @Param('productId') productId: string,
  ): Promise<ProductVariant[]> {
    return this.service.findByProduct(productId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update product variant',
  })
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete product variant',
  })
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get('detail/:id')
  @ApiOperation({
    summary: 'Get variant by id',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
