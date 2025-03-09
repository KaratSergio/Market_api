import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateAdDto {
  @ApiProperty({
    description: 'Title of the ad.',
    example: 'Brand new Laptop for sale',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the ad.',
    example: 'This laptop is brand new and in perfect condition.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the item.',
    example: '599.99',
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Category ID of the ad.',
    example: 'electronics',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Subcategory ID of the ad.',
    example: 'laptops',
  })
  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  @ApiProperty({
    description: 'Location of the ad (optional).',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'List of images uploaded for the ad.',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  images?: string[];
}
