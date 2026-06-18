import { Module } from '@nestjs/common';

import { IngredientsController } from './controllers/ingredients.controller';
import { IngredientsService } from './services/ingredients.service';
import { IngredientsRepository } from './repositories/ingredients.repository';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService, IngredientsRepository],
  exports: [IngredientsService, IngredientsRepository],
})
export class IngredientsModule {}
