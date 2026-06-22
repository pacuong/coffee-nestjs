import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
  @IsNumber()
  price?: number;
}
