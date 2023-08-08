import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CartStatus, ProductCategory } from 'src/utils/enums';
import { Type } from 'class-transformer';
import { DtoErrorMessage } from 'src/utils/constants';

export class CreateProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_productName })
  product_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_price })
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  product_img: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_quantity })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_category })
  category: ProductCategory;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class cartProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_quantity })
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: CartStatus;
}