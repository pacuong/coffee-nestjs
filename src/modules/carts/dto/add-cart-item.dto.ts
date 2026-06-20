import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

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
}
