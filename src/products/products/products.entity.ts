import { UsersEntity } from "src/users/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class ProductsEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    product_img: string;

    @ManyToOne(() => UsersEntity, (users) => users.products)
    purchased_by: UsersEntity
}