import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductCategory } from 'src/utils/enums';

export class CreateProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  product_img: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  category: ProductCategory;
}

export class UpdateDTO extends PartialType(CreateProductDto){}