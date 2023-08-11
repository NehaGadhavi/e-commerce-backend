import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { EntityManager, Repository } from 'typeorm';
import { UsersEntity } from 'src/auth/users.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  cartProductDto,
} from 'src/dtos/product.dto';
import { CartProductsEntity } from './cart-products.entity';
import { CartStatus } from 'src/utils/enums';
import { GlobalResponseType } from 'src/utils/types';
import {
  DATABASE_ERROR_MSG,
  ERROR_MSG,
  ResponseMap,
  SUCCESS_MSG,
} from 'src/utils/constants';
import * as path from 'path';
import { unlink } from 'fs/promises';
import { ShippingDetailsDto } from 'src/dtos/shipping-details.dto';
import { ShippingDetailsEntity } from './shipping-details.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(CartProductsEntity)
    private cartProductRepository: Repository<CartProductsEntity>,
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private readonly entityManager: EntityManager,
    @InjectRepository(ShippingDetailsEntity)
    private shippingRepository: Repository<ShippingDetailsEntity>,
  ) {}

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    category: number | null = null, // Default to null if no category is specified
    sortOrder: 'asc' | 'desc' = null, // Default to random order if no sortOrder is specified
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {}; // Where condition for filtering

      if (category !== null) {
        where.category = category;
      }

      const queryBuilder =
        this.productsRepository.createQueryBuilder('product');

      queryBuilder.where(where);
      queryBuilder.take(limit);
      queryBuilder.skip(skip);

      // Add sorting based on sortOrder parameter
      if (sortOrder === 'asc') {
        queryBuilder.orderBy('product.price', 'ASC');
      } else if (sortOrder === 'desc') {
        queryBuilder.orderBy('product.price', 'DESC');
      }

      return queryBuilder.getMany();
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

      if (!savedProduct) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_save);
      }

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
        throw new NotFoundException(ERROR_MSG.not_found);
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

      const updatedProduct = await this.productsRepository.update(
        product.id,
        product,
      );

      if (!updatedProduct) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_update);
      }

      return ResponseMap(
        {
          updatedProduct,
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
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(ERROR_MSG.product_not_found);
      }

      const imagePath = product.product_img; // Get the image path from the product

      const result = await this.productsRepository.delete({ id });

      if (result.affected === 0) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_delete);
      }

      // Delete the image from the local public folder
      if (imagePath) {

        const absoluteImagePath = path.resolve(
          __dirname,
          '..',
          '..',
          'public',
          imagePath,
        );

        if (absoluteImagePath) {
          try {
            await unlink(absoluteImagePath);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }

      return ResponseMap(
        {
          success: true,
        },
        SUCCESS_MSG.product_delete_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCarts(user: UsersEntity) {
    try {
      const cartProducts = await this.cartProductRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.products', 'products')
        .where('cart.usersId = :userId', { userId: user.id })
        .andWhere('cart.status = :status', { status: CartStatus.IN_CART })
        .getMany();

      if (!cartProducts) {
        throw new NotFoundException(ERROR_MSG.no_products_to_buy);
      }

      // // Remove the 'quantity' property from each 'products' object
      // const transformedCartProducts = cartProducts.map((cartProduct) => {
      //   const { products, ...rest } = cartProduct;
      //   const sanitizedProduct = { ...products };
      //   delete sanitizedProduct.quantity;
      //   return { ...rest, products: sanitizedProduct };
      // });

      return { data: cartProducts };
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

      if (cartDto.quantity === 0) {
        throw new BadRequestException(ERROR_MSG.cant_be_added);
      }

      // Check for sufficient quantity
      if (product.quantity < cartDto.quantity) {
        throw new BadRequestException(ERROR_MSG.not_enough_products);
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

      // Check if product is added to cart
      if (!isSaved) {
        throw new BadRequestException(DATABASE_ERROR_MSG.add_to_cart);
      }

      const updatedQuantityProduct = new ProductsEntity();
      updatedQuantityProduct.quantity = product.quantity - cartDto.quantity;

      const isUpdated = await this.productsRepository.update(
        product.id,
        updatedQuantityProduct,
      );

      // Check if product updated
      if (!isUpdated) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_update);
      }

      return ResponseMap(
        {
          productToAdd,
        },
        SUCCESS_MSG.add_to_cart_success,
      );
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
        throw new NotFoundException(ERROR_MSG.not_in_cart);
      }

      const foundProduct = await this.productsRepository.findOne({
        where: { id: toBeRemoved.products.id },
      });

      const result = await this.cartProductRepository.delete({ id });

      if (result.affected === 0) {
        throw new BadRequestException(DATABASE_ERROR_MSG.cart_delete);
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

  async purchaseProduct(user: UsersEntity): GlobalResponseType {
    try {
      const cartProducts = await this.cartProductRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.users', 'users')
        .leftJoinAndSelect('cart.products', 'products')
        .where('cart.users.id = :userId', { userId: user.id })
        .andWhere('cart.status = :status', { status: CartStatus.IN_CART })
        .getMany();

      if (cartProducts.length === 0) {
        throw new NotFoundException(ERROR_MSG.no_products_to_buy);
      }

      const productIdsToUpdate = cartProducts.map(
        (cartProduct) => cartProduct.id,
      );

      const result = await this.cartProductRepository.update(
        productIdsToUpdate,
        {
          status: CartStatus.SOLD,
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException(DATABASE_ERROR_MSG.product_purchase);
      }

      const isUpdated = await this.changeUserPurchases(cartProducts, user);
      if (!isUpdated) {
        throw new BadRequestException(DATABASE_ERROR_MSG.product_update);
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
    soldProducts: CartProductsEntity[],
    user: UsersEntity,
  ) {
    try {
      const totalItemsBought = soldProducts.reduce(
        (total, cartProduct) => total + cartProduct.quantity,
        0,
      );

      const totalPayment = soldProducts.reduce(
        (total, cartProduct) =>
          total + cartProduct.quantity * cartProduct.products.price,
        0,
      );

      const updateUser = new UsersEntity();
      updateUser.total_purchase = user.total_purchase + totalItemsBought;
      updateUser.total_payment = user.total_payment + totalPayment;

      const isUpdated = await this.userRepository.update(user.id, updateUser);

      return isUpdated;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuantity(id: number, quantity: number): GlobalResponseType {
    const cartProduct = await this.cartProductRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.products', 'products')
      .where('cart.id = :id', { id })
      .getOne();

    if (!cartProduct) {
      throw new NotFoundException(ERROR_MSG.not_in_cart);
    }

    const product = await this.productsRepository.findOne({
      where: { id: cartProduct.products.id },
    });

    if (!product) {
      throw new NotFoundException(ERROR_MSG.product_not_found);
    }

    // Calculate quantity difference
    const quantityDifference = quantity - cartProduct.quantity;

    // Check if there are enough products available in products table
    if (product.quantity < quantityDifference) {
      throw new BadRequestException(ERROR_MSG.not_enough_products);
    }

    // Update cart product quantity
    cartProduct.quantity = quantity;

    // Update product quantity based on quantity difference
    product.quantity = product.quantity - quantityDifference;

    // Save changes using transaction
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(CartProductsEntity, cartProduct);
      await transactionalEntityManager.save(ProductsEntity, product);
    });

    return ResponseMap(
      {
        isUpdated: true,
      },
      SUCCESS_MSG.cart_update_success,
    );
  }

  async saveShippingDetails(
    user: UsersEntity,
    shippingDto: ShippingDetailsDto,
  ): GlobalResponseType {
    try {
      const shippingDetails = await this.shippingRepository.save({
        first_name: shippingDto.first_name,
        last_name: shippingDto.last_name,
        email: shippingDto.email,
        address_line1: shippingDto.address_line1,
        address_line2: shippingDto.address_line2,
        city: shippingDto.city,
        zip_postal: shippingDto.zip_postal,
        country: shippingDto.country,
        zip_code: shippingDto.zip_code,
        bought_by: user.id,
      });

      if (!shippingDetails) {
        throw new BadRequestException(DATABASE_ERROR_MSG.shippingDetails_save);
      }

      if (shippingDetails) {
        this.purchaseProduct(user);
      }

      return ResponseMap(
        { shippingDetails },
        SUCCESS_MSG.details_saved_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
