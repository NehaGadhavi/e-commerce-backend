import { IsNotEmpty, isNotEmpty } from "class-validator";
import { UsersEntity } from "src/users/users/users.entity";

export class CreateProdutDto{
    id: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    price: number;

    description: string;

    product_img: string;

    purchased_by: UsersEntity;
}