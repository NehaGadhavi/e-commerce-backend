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
import fs from 'fs';
import { GlobalResponseType } from 'src/utils/types';
import {
  DATABASE_ERROR_MSG,
  ERROR_MSG,
  ResponseMap,
  SUCCESS_MSG,
} from 'src/utils/constants';
import path from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(CartProductsEntity)
    private cartProductRepository: Repository<CartProductsEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  //methods for products table
  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category: number | null = null, // Default to null if no category is specified
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {}; // Where condition for filtering

      if (category !== null) {
        where.category = category;
      }

      const products = await this.productsRepository.find({
        take: limit,
        skip,
        where,
      });
      return products;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProduct(id: number) {
    return await this.productsRepository.findOne({ where: { id } });
  }

  async addProduct(
    productDto: CreateProductDto,
    user: UsersEntity,
    image: Express.Multer.File,
  ): GlobalResponseType {
    try {
      const product = new ProductsEntity();
      product.product_name = productDto.product_name;
      product.price = Number(productDto.price);
      product.description = productDto.description;
      product.quantity = Number(productDto.quantity);
      product.category = Number(productDto.category);

      // Save the image path or link to the database
      if (image.filename) {
        product.product_img = 'uploads/' + image.filename;
      } else {
        product.product_img = '';
      }

      const savedProduct = await this.productsRepository.save(product);

      return ResponseMap(
        {
          savedProduct,
        },
        SUCCESS_MSG.product_add_success,
      );
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

      const data = await builder.getMany();

      if (data.length <= 0) {
        throw new BadRequestException(ERROR_MSG.not_found);
      }

      return {
        data: data,
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
  ): GlobalResponseType {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(ERROR_MSG.product_not_found);
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
      product.category = Number(productDto.category);
      // Update the image path or link to the database
      if (image.filename) {
        product.product_img = 'uploads/' + image.filename;
      } else {
        product.product_img = '';
      }

      const savedProduct = await this.productsRepository.update(
        product.id,
        product,
      );

      if (!savedProduct) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_update);
      }

      return ResponseMap(
        {
          savedProduct,
        },
        SUCCESS_MSG.product_update_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeProduct(id: number, user: UsersEntity): GlobalResponseType {
    try {
      const product = await this.productsRepository.findOne({ where: { id } }); // Fetch the product

      if (!product) {
        throw new NotFoundException(DATABASE_ERROR_MSG.product_delete);
      }

      const imagePath = product.product_img; // Get the image path from the product

      const result = await this.productsRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(DATABASE_ERROR_MSG.product_delete);
      } else {
        // Delete the image from the local public folder
        if (imagePath) {
          console.log(imagePath);

          try {
            await unlink(imagePath);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }

        return ResponseMap(
          {
            success: true,
          },
          SUCCESS_MSG.product_delete_success,
        );
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
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addToCart(
    id: number,
    cartDto: cartProductDto,
    user: UsersEntity,
  ): GlobalResponseType {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      // Check for sufficient quantity
      if (product.quantity <= cartDto.quantity) {
        throw new BadRequestException(ERROR_MSG.not_enogh_products);
      }

      const productToAdd = new CartProductsEntity();
      productToAdd.products = product;
      productToAdd.users = user;
      productToAdd.quantity = Number(cartDto.quantity);
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
        return ResponseMap(
          {
            productToAdd,
          },
          SUCCESS_MSG.add_to_cart_success,
        );
      } else {
        throw new BadRequestException(DATABASE_ERROR_MSG.add_to_cart);
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromCart(id: number, user: UsersEntity): GlobalResponseType {
    try {
      const toBeRemoved = await this.cartProductRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.users', 'users')
        .leftJoinAndSelect('cart.products', 'products')
        .where('cart.id = :id', { id })
        .getOne();

      if (!toBeRemoved) {
        throw new BadRequestException(ERROR_MSG.not_in_cart);
      }

      const foundProduct = await this.productsRepository.findOne({
        where: { id: toBeRemoved.products.id },
      });

      const result = await this.cartProductRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(DATABASE_ERROR_MSG.cart_delete);
      }
      const isUpdated = await this.updateQuantityInProduct(
        foundProduct,
        toBeRemoved,
      );

      if (!isUpdated) {
        throw new BadRequestException(ERROR_MSG.product_not_updated);
      }

      return ResponseMap(
        {
          success: true,
        },
        SUCCESS_MSG.cart_delete_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuantityInProduct(
    foundProduct: ProductsEntity,
    toBeRemoved: CartProductsEntity,
  ) {
    // Update quantity in Products table
    const updatedQuantityProduct = new ProductsEntity();
    updatedQuantityProduct.quantity =
      foundProduct.quantity + toBeRemoved.quantity;
    const isUpdated = await this.productsRepository.update(
      toBeRemoved.products.id,
      updatedQuantityProduct,
    );

    if (isUpdated) {
      return true;
    } else {
      return false;
    }
  }

  async purchaseProduct(id: number, user: UsersEntity): GlobalResponseType {
    try {
      const cartProduct = await this.cartProductRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.users', 'users')
        .leftJoinAndSelect('cart.products', 'products')
        .where('cart.id = :id', { id })
        .getOne();

      if (cartProduct.users.id !== user.id) {
        throw new BadRequestException(ERROR_MSG.unauthorized_to_buy);
      }

      if (!cartProduct) {
        throw new NotFoundException(ERROR_MSG.not_in_cart);
      }

      if (cartProduct.status === CartStatus.SOLD) {
        throw new BadRequestException(ERROR_MSG.already_bought);
      }

      const result = await this.cartProductRepository.update(id, {
        status: CartStatus.SOLD,
      });

      if (result.affected === 0) {
        throw new NotFoundException(DATABASE_ERROR_MSG.product_purchase);
      } else {
        const isChanged = await this.changeUserPurchases(cartProduct, user);
      }

      return ResponseMap(
        { success: true },
        SUCCESS_MSG.product_purchase_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeUserPurchases(
    soldProduct: CartProductsEntity,
    user: UsersEntity,
  ) {
    try {
      if (soldProduct.users.id === user.id) {
        const updateUser = new UsersEntity();
        updateUser.total_purchase = user.total_purchase + soldProduct.quantity;
        updateUser.total_payment =
          user.total_payment +
          soldProduct.quantity * soldProduct.products.price;

        const isUpdated = await this.userRepository.update(user.id, updateUser);

        return isUpdated;
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuantity(id: number, quantity: number): GlobalResponseType {
    //yet to be done: when quantity is increased or decreased it should get reflected in products table
    const product = await this.productsRepository.findOne({ where: { id } });

    // Check for sufficient quantity
    if (product.quantity <= quantity) {
      throw new BadRequestException(ERROR_MSG.not_enogh_products);
    }

    const updatedQuantityProduct = new CartProductsEntity();
    updatedQuantityProduct.quantity = quantity;

    const cartProduct = await this.cartProductRepository.update(
      id,
      updatedQuantityProduct,
    );

    if (cartProduct) {
      return ResponseMap(
        {
          cartProduct,
        },
        SUCCESS_MSG.cart_update_success,
      );
    } else {
      throw new BadRequestException(DATABASE_ERROR_MSG.cart_update);
    }
  }
}
