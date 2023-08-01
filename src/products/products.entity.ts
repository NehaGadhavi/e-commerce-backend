import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartProductsEntity } from './cart-products.entity';
import { ProductCategory } from 'src/product-category.enum';

@Entity('products')
export class ProductsEntity {
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

  @OneToMany(() => CartProductsEntity, (cartProducts) => cartProducts.products)
  cartProducts: CartProductsEntity;

  @Column()
  quantity: number;

  @Column({ type: 'integer' })
  category: ProductCategory;
}
