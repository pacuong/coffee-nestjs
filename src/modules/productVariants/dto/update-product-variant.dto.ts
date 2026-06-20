import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductVariantDto {
  @ApiPropertyOptional({
    example: 'Size XL',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 59000,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}
