import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CartStatus, GenderCategory } from '../utils/enums';
import { Type } from 'class-transformer';
import { DtoErrorMessage } from '../utils/constants';
import { UsersEntity } from '../auth/users.entity';
import { ProductsEntity } from '../products/products.entity';

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
  @IsNotEmpty({ message: DtoErrorMessage.empty_description })
  description: string;

  @ApiProperty()
  product_img: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_quantity })
  quantity: number;

  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_category })
  category: GenderCategory;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class cartProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: DtoErrorMessage.empty_quantity })
  quantity: number;

  @ApiProperty()
  users: UsersEntity;

  @ApiProperty()
  products: ProductsEntity;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: CartStatus;
}
