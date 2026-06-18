import { IsString, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
