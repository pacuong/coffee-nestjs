import { Module } from '@nestjs/common';

import { RecipesController } from './controllers/recipes.controller';
import { RecipesService } from './services/recipes.service';
import { RecipesRepository } from './repositories/recipes.repository';

@Module({
  controllers: [RecipesController],
  providers: [RecipesService, RecipesRepository],
  exports: [RecipesService, RecipesRepository],
})
export class RecipesModule {}
