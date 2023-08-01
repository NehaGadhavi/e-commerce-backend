import { UsersEntity } from 'src/auth/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { ProductCategory } from 'src/product-category.enum';

@Entity('cart_products')
export class CartProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (users) => users.cartProducts)
  users: UsersEntity;

  @ManyToOne(() => ProductsEntity, (products) => products.cartProducts)
  products: ProductsEntity;

  @Column()
  quantity: number;

  @Column()
  status: string;

}
