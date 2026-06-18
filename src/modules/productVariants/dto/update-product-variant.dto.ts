import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
