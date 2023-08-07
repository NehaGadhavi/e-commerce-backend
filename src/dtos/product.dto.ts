import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CartStatus, ProductCategory } from 'src/utils/enums';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  product_img: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  category: ProductCategory;
}

export class UpdateProductDto extends PartialType(CreateProductDto){}

export class cartProductDto{

  @ApiProperty()
  // @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: CartStatus;
}