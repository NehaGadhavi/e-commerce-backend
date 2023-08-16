import { CartProductsEntity } from '../products/cart-products.entity';
import { GenderCategory, UserRoles } from '../utils/enums';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.users)
  cartProducts: CartProductsEntity[];

  @Column({ default: null })
  gender: GenderCategory;

  @Column({ default: null })
  dob: string;

  @Column({ default: null })
  address: string;

  @Column({ default: null })
  total_purchase: number;

  @Column({ default: null })
  total_payment: number;

  async validatePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
