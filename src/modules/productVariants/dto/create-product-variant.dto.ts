import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'cmqh89zyk0001vy14blvnute4',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 'Size L',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 49000,
  })
  @Type(() => Number)
  @IsNumber()
  price: number;
}
