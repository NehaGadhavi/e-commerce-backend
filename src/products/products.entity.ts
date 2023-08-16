import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartProductsEntity } from './cart-products.entity';
import { GenderCategory } from '../utils/enums';

@Entity('products')
export class ProductsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'PK Auto Increment' })
  id: number;

  @Column({ nullable: false })
  product_name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ default: null })
  product_img: string;

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.products)
  cartProducts: CartProductsEntity;

  @Column({ nullable: false })
  quantity: number;

  @Column({ type: 'integer', nullable: false })
  category: GenderCategory;
}
