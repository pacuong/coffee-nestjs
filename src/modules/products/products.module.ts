import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { CategoriesModule } from '../categories/categories.module';

import { ProductsController } from './controllers/products.controller';

import { ProductsService } from './services/products.service';

import { ProductsRepository } from './repositories/products.repository';

@Module({
  imports: [PrismaModule, CategoriesModule],

  controllers: [ProductsController],

  providers: [ProductsService, ProductsRepository],

  exports: [ProductsRepository],
})
export class ProductsModule {}
