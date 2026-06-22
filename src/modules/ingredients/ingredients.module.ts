import { Module } from '@nestjs/common';

import { IngredientsController } from './controllers/ingredients.controller';
import { IngredientsService } from './services/ingredients.service';
import { IngredientsRepository } from './repositories/ingredients.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [IngredientsController],
  providers: [IngredientsService, IngredientsRepository],
  exports: [IngredientsService, IngredientsRepository],
})
export class IngredientsModule {}
