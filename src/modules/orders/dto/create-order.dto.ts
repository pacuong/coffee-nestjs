import { IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsOptional()
  @IsString()
  note?: string;
}
