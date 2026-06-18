import { IsNumber, IsString } from 'class-validator';

export class RecipeItemDto {
  @IsString()
  ingredientId: string;

  @IsNumber()
  quantity: number;
}
