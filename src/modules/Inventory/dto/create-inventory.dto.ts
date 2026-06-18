import { IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  ingredientId: string;

  @IsNumber()
  quantity: number;
}
