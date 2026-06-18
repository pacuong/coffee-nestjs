import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
