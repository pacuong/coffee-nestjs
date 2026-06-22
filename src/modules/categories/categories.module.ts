import { Module } from '@nestjs/common';

import { CategoriesController } from './controllers/categories.controller';

import { CategoriesService } from './services/categories.service';

import { CategoriesRepository } from './repositories/categories.repository';

import { PrismaModule } from '../../prisma/prisma.module';
import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],

  controllers: [CategoriesController],

  providers: [CategoriesService, CategoriesRepository],

  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
