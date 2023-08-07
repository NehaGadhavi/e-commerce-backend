import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { Repository, getRepository } from 'typeorm';
import { UsersEntity } from 'src/auth/users.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  cartProductDto,
} from 'src/dtos/product.dto';
import { CartProductsEntity } from './cart-products.entity';
import { CartStatus, UserRoles } from 'src/utils/enums';

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
    try {
      const skip = (page - 1) * limit;

      return this.productsRepository.find({
        take: limit,
        skip,
      });
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProduct(user: UsersEntity, id: number) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async addProduct(
    productDto: CreateProductDto,
    user: UsersEntity,
    image: Express.Multer.File,
  ) {
    try {
      const product = new ProductsEntity();
      product.product_name = productDto.product_name;
      product.price = Number(productDto.price);
      product.description = productDto.description;
      product.quantity = Number(productDto.quantity);
      product.category = productDto.category;

      // Save the image path or link to the database
      if (image.filename) {
        product.product_img = 'uploads/' + image.filename;
      } else {
        product.product_img = '';
      }

      return await this.productsRepository.save(product);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchText(req) {
    try {
      const builder = await this.productsRepository.createQueryBuilder(
        'products',
      );

      if (req.query.search) {
        builder.where(
          'products.product_name LIKE :s OR products.description LIKE :s',
          { s: `%${req.query.search}%` },
        );
      }

      // Sorting products in ascending order
      const sort: any = 'ASC';
      builder.orderBy('products.price', sort.toUpperCase());

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
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(
    id: number,
    productDto: UpdateProductDto,
    user: UsersEntity,
    image: Express.Multer.File,
  ) {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Product not found!');
      }

      // Object.keys(ProductDto).forEach((key) => {
      //   if (ProductDto[key]) {
      //     product[key] = ProductDto[key];
      //   }
      // });

      product.id = id;
      product.product_name = productDto.product_name;
      product.price = Number(productDto.price);
      product.description = productDto.description;
      product.quantity = Number(productDto.quantity);
      product.category = productDto.category;
      // Update the image path or link to the database
      if (image.filename) {
        product.product_img = 'uploads/' + image.filename;
      } else {
        product.product_img = '';
      }

      const savedProduct = await this.productsRepository.update(
        product.id,
        product
      );

      return { data: savedProduct };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeProduct(id: number, user: UsersEntity) {
    try {
      const result = await this.productsRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException('Product not removed!');
      } else {
        return { success: true };
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //methods for carts table
  async getAllCarts(user: UsersEntity) {
    try {
      if (user.roles !== UserRoles.Customer) {
        throw new ForbiddenException('Only customers can access their carts.');
      }

      // Use QueryBuilder to fetch cart products for the specific user
      const cartProducts = await this.cartProductRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.products', 'products')
        .where('cart.usersId = :userId', { userId: user.id })
        .getMany();

      // Remove the 'quantity' property from each 'products' object
      const transformedCartProducts = cartProducts.map((cartProduct) => {
        const { products, ...rest } = cartProduct;
        const sanitizedProduct = { ...products };
        delete sanitizedProduct.quantity;
        return { ...rest, products: sanitizedProduct };
      });
      
      return { data: transformedCartProducts };

      // return { data: cartProducts };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addToCart(id: number, cartDto: cartProductDto, user: UsersEntity) {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      if(product.quantity<=cartDto.quantity){
        throw new BadRequestException('Not enough Quantity!');
      }

      const productToAdd = new CartProductsEntity();
      productToAdd.products = product;
      productToAdd.users = user;
      productToAdd.quantity = cartDto.quantity;
      if (cartDto.status) {
        productToAdd.status = cartDto.status;
      } else {
        productToAdd.status = CartStatus.IN_CART;
      }
      const isSaved = await this.cartProductRepository.save(productToAdd);

      // Check if product is added to cart,
      // if so then update quantity in products table
      if (isSaved) {
        const updatedQuantityProduct = new ProductsEntity();
        updatedQuantityProduct.quantity = product.quantity - cartDto.quantity;

        await this.productsRepository.update(
          product.id,
          updatedQuantityProduct,
        );
      }

      return { data: productToAdd };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromCart(id: number, user: UsersEntity) {
    try {
      const result = await this.cartProductRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException('Product not removed from cart!');
      } else {
        return { success: true };
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async purchaseProduct(id: number, user: UsersEntity) {
    const updatedStatusProduct = new CartProductsEntity();
    updatedStatusProduct.status = CartStatus.SOLD;
    const product = await this.cartProductRepository.update(
      id,
      updatedStatusProduct,
    );
    if (product) {
      return { success: true };
    }
  }

  async updateCart(id: number, cartDto: cartProductDto, user: UsersEntity){
    const cartProduct = await this.cartProductRepository.update(id, cartDto);
    console.log(cartProduct);
    
  }
}
