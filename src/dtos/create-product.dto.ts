import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

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
    category: string;

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
    category: string;
}

export class cartProductDto extends CreateProductDto{
    @ApiProperty()
    status: string;
}