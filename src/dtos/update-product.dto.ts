import { ApiProperty } from "@nestjs/swagger";

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