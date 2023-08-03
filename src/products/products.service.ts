import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/auth/users.entity';
import { CreateProductDto } from 'src/dtos/create-product.dto';
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
  async getAllProducts(
    page: number = 1,
    limit: number = 10,
  ): Promise<ProductsEntity[]> {
    const skip = (page - 1) * limit;

    return this.productsRepository.find({
      take: limit,
      skip,
    });
  }

  async getProduct(user: UsersEntity, id: number) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async addProduct(
    productDto: CreateProductDto,
    user: UsersEntity,
    image: Express.Multer.File,
  ) {
    const product = new ProductsEntity();
    product.product_name = productDto.product_name;
    product.price = productDto.price;
    product.description = productDto.description;
    product.quantity = productDto.quantity;
    product.category = productDto.category;

    // Save the image path or link to the database
    if (image.filename) {
      product.product_img = 'uploads/' + image.filename;
    } else {
      product.product_img = '';
    }

    console.log(product);

    try {
      return await this.productsRepository.save(product);
    } catch (err) {
      console.log(err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, product not added!',
      );
    }
  }

  async searchText(req) {
    console.log(req.query);
    const builder = await this.productsRepository.createQueryBuilder(
      'products',
    );

    if (req.query.search) {
      builder.where(
        'products.product_name LIKE :s OR products.description LIKE :s',
        { s: `%${req.query.search}%` },
      );
    }

    const sort: any = req.query.sort;

    if (sort) {
      builder.orderBy('products.price', sort.toUpperCase());
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = parseInt(req.query.limit as any) || 5;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    return {
      data: await builder.getMany(),
      total,
      page,
      last_page: Math.ceil(total / perPage),
    };
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

  async addToCart(
    id: number,
    productToAdd: updateProductDto,
    user: UsersEntity,
  ) {
    const product = await this.productsRepository.findOne({ where: { id } });

    /*update quantity*/
    if (productToAdd.quantity) {
      const { quantity } = productToAdd;
      const updatedQuantity = product.quantity - productToAdd.quantity;
      productToAdd.quantity = updatedQuantity;
      // console.log(updatedQuantity);
      this.updateProduct(id, productToAdd, user);
      product.quantity = quantity;
    } else {
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

  async removeFromCart(id: number, user: UsersEntity) {
    const result = await this.cartProductRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Product not removed from cart!');
    } else {
      return { success: true };
    }
  }
}
