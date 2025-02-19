import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsArray,
  ArrayMinSize,
  IsObject,
} from 'class-validator';

class ImageDto {
  @ApiProperty({
    description: 'The URL of the image.',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateAdDto {
  @ApiProperty({
    description: 'The title of the advertisement.',
    example: 'Brand new Laptop for sale',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the advertisement.',
    example: 'This laptop is brand new and in perfect condition.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The price of the advertisement in decimal format.',
    example: '599.99',
  })
  @IsDecimal()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'The category ID for the advertisement.',
    example: 'electronics',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'The subcategory ID for the advertisement.',
    example: 'laptops',
  })
  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  @ApiProperty({
    description: 'The location of the advertisement (optional).',
    example: 'New York',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'A list of images associated with the advertisement.',
    type: [ImageDto],
    required: false,
    example: [{ url: 'https://example.com/image1.jpg' }],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  images?: ImageDto[];
}
