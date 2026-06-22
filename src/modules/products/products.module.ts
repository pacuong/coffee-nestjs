import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { CategoriesModule } from '../categories/categories.module';

import { ProductsController } from './controllers/products.controller';

import { ProductsService } from './services/products.service';

import { ProductsRepository } from './repositories/products.repository';
import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CategoriesModule, CloudinaryModule],

  controllers: [ProductsController],

  providers: [ProductsService, ProductsRepository],

  exports: [ProductsRepository],
})
export class ProductsModule {}
