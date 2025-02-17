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
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  subcategoryId: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  images?: ImageDto[];
}
