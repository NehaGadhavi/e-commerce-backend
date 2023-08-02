import { CartProductsEntity } from 'src/products/cart-products.entity';
import { ProductsEntity } from 'src/products/products.entity';
import { UserRoles } from 'src/user-roles.enum';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
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

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.users )
  cartProducts: CartProductsEntity[];

  @Column()
  gender: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column()
  address: string;
}
