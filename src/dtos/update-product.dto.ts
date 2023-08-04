import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class updateProductDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    product_name: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    product_img: Express.Multer.File;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    quantity: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    category: string;
}