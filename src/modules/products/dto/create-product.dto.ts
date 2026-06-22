import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Matcha Latte' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'cmqh89zyk0001vy14blvnute4' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'Best seller' })
  @IsOptional()
  @IsString()
  description?: string;
}
