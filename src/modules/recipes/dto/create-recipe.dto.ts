import {
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { RecipeItemDto } from './recipe-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({
    example: 'cmqh9gr190003vyysuyvx9ttw',
  })
  @IsString()
  variantId: string;

  @ApiProperty({
    type: [RecipeItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipeItemDto)
  items: RecipeItemDto[];
}
