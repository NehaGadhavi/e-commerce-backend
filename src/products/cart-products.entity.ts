import { UsersEntity } from 'src/auth/users.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { CartStatus } from 'src/utils/enums';

@Entity('cart_products')
export class CartProductsEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (users) => users.cartProducts)
  users: UsersEntity;

  @ManyToOne(() => ProductsEntity, (products) => products.cartProducts)
  products: ProductsEntity;

  @Column({nullable: true})
  quantity: number;

  @Column({ type: 'integer', default: CartStatus.IN_CART })
  status: CartStatus;

}
