import { ApiProperty } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";

export class cartProductDto extends CreateProductDto{
    @ApiProperty()
    status: string;
}