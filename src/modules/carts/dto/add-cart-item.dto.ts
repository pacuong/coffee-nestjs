import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemToppingDto {
  @ApiProperty({
    example: 'cmqh9gr190003vyysuyvx9ttw',
  })
  @IsString()
  toppingId: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class AddCartItemDto {
  @ApiProperty({
    example: 'cmqh9gr190003vyysuyvx9ttw',
  })
  @IsString()
  variantId: string;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: [
      {
        toppingId: 'cmqh9gr190003vyysuyvx9ttw',
        quantity: 1,
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddCartItemToppingDto)
  toppings?: AddCartItemToppingDto[];
}
