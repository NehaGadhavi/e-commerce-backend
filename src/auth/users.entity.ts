import { CartProductsEntity } from 'src/products/cart-products.entity';
import { UserRoles } from 'src/utils/enums';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.users )
  cartProducts: CartProductsEntity[];

  @Column({ default: null})
  gender: string;

  @Column({ default: null})
  dob: string;

  @Column({ default: null})
  address: string;

  async validatePassword(attempt: string): Promise<boolean> {
		return await bcrypt.compare(attempt, this.password);
	}
}
