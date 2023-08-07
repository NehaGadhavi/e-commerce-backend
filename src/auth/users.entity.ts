import { CartProductsEntity } from 'src/products/cart-products.entity';
import { UserRoles } from 'src/utils/enums';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'PK Auto Increment' })
  id: number;

  @Column({ default: ''})
  username: string;

  @Column({ default: ''})
  email: string;

  @Column({ default: ''})
  password: string;

  @Column({ type: 'integer', default: UserRoles.Customer })
  roles: UserRoles;

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.users )
  cartProducts: CartProductsEntity[];

  @Column({ default: ''})
  gender: string;

  @Column({ default: ''})
  dob: string;

  @Column({ default: ''})
  address: string;
}
