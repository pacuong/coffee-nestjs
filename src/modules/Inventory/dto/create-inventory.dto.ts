import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'cmqjdep9s0001vyno20beed06',
  })
  @IsString()
  ingredientId: string;

  @ApiProperty({
    example: 5000,
  })
  @IsNumber()
  quantity: number;
}
