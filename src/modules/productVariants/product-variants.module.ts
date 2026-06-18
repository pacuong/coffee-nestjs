import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from '../products/products.module';

import { ProductVariantsController } from './controllers/product-variants.controller';
import { ProductVariantsService } from './services/product-variants.service';
import { ProductVariantsRepository } from './repositories/product-variants.repository';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, ProductVariantsRepository],
})
export class ProductVariantsModule {}
