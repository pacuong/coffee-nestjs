import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateToppingDto {
  @ApiProperty({
    example: 'Trân châu đen',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 10000,
  })
  @IsNumber()
  price: number;
}
