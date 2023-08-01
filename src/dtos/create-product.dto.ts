import { IsNotEmpty, isNotEmpty } from "class-validator";
import { UsersEntity } from "src/users/users/users.entity";
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
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    category: string;
    // category: ProductCategory;

}

export class updateProductDto{
    @ApiProperty()
    id: number;

    @ApiProperty()
    product_name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    product_img: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    category: string;
}