import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from 'src/modules/ingredients/dto/create-ingredient.dto';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
