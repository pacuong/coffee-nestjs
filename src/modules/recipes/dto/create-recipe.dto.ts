import { IsArray, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';

import { RecipeItemDto } from './recipe-item.dto';

export class CreateRecipeDto {
  @IsString()
  variantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeItemDto)
  items: RecipeItemDto[];
}
