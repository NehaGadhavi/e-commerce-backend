import { CartProductsEntity } from 'src/products/cart-products.entity';
import { ProductsEntity } from 'src/products/products.entity';
import { UserRoles } from 'src/user-roles.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ comment: 'PK Auto Increment' })
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'integer', default: UserRoles.Customer })
  roles: UserRoles;

  // @Column({ nullable: true })
  // items_purchased: number;

  // @Column({ nullable: true })
  // total_payment: number;

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.users )
  cartProducts: CartProductsEntity[];
}
