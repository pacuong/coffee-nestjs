import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiPropertyOptional({
    example: 'Ít đá, ít đường',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
