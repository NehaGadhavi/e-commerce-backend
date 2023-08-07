import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartProductsEntity } from './cart-products.entity';
import { ProductCategory } from 'src/utils/enums';

@Entity('products')
export class ProductsEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ''})
  product_name: string;

  @Column({ default: ''})
  description: string;

  @Column({nullable: true})
  price: number;

  @Column({ default: ''})
  product_img: string;

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.products)
  cartProducts: CartProductsEntity;

  @Column({nullable: true})
  quantity: number;

  @Column({ type: 'integer', nullable: true })
  category: ProductCategory;
}
