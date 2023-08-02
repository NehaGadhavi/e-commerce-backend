import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/auth/users.entity';
import {
  CreateProductDto,
} from 'src/dtos/create-product.dto';
import { CartProductsEntity } from './cart-products.entity';
import { updateProductDto } from 'src/dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(CartProductsEntity)
    private cartProductRepository: Repository<CartProductsEntity>,
  ) {}

  //methods for products table
  async getAllProducts(user: UsersEntity) {
    return await this.productsRepository.find();
  }

  async getProduct(user: UsersEntity, id: number) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async addProduct(productDto: CreateProductDto, user: UsersEntity) {
    const product = new ProductsEntity();
    product.product_name = productDto.product_name;
    product.price = productDto.price;
    product.description = productDto.description;
    product.product_img = productDto.product_img;
    product.quantity = productDto.quantity;

    this.productsRepository.create(product);
    try {
      return await this.productsRepository.save(product);
    } catch (err) {
      console.log(err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, product not added!',
      );
    }
  }

  async updateProduct(
    id: number,
    ProductDto: updateProductDto,
    user: UsersEntity,
  ): Promise<ProductsEntity> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    Object.keys(ProductDto).forEach((key) => {
      if (ProductDto[key] !== undefined) {
        product[key] = ProductDto[key];
      }
    });

    console.log(product);

    try {
      await this.productsRepository.save(product);
      return product;
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async removeProduct(id: number, user: UsersEntity) {
    const result = await this.productsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Product not removed!');
    } else {
      return { success: true };
    }
  }

  //methods for carts table
  async getAllCarts(user: UsersEntity) {
    return await this.cartProductRepository.find();
  }

  async addToCart(id: number, productToAdd: updateProductDto, user: UsersEntity) {
    console.log('id: ',id);
    console.log('toAdd: ',productToAdd);
    console.log('user: ',user);
    const product = await this.productsRepository.findOne({ where: { id } });
    console.log('product: ',product);

    /*update quantity*/
    if (productToAdd.quantity) {
      const {quantity} = productToAdd;
      const updatedQuantity = product.quantity - productToAdd.quantity;
      productToAdd.quantity = updatedQuantity;
      // console.log(updatedQuantity);
      this.updateProduct(id, productToAdd, user);
      product.quantity = quantity;
    } else{
      throw new Error('Quality not added!! Please add quality.');
    }


    try {
      return await this.cartProductRepository.save(product);
    } catch (err) {
      console.log(err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, product not added to Cart!',
      );
    }
  }

  async removeFromCart(id: number, user: UsersEntity){
    const result = await this.cartProductRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Product not removed from cart!');
    } else {
      return { success: true };
    }
  }
}
