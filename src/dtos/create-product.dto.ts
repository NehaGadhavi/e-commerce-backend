import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from "src/product-category.enum";

export class CreateProductDto{
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
    product_img: string;

    @ApiProperty()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    category: ProductCategory;

}