import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UsersEntity } from 'src/auth/users.entity';
import { User } from 'src/user.decorator';
import { CreateProductDto, updateProductDto } from 'src/dtos/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Products")
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  //apis for products table
  @ApiOperation({ summary: "Get all products" })
  @Get('all')
  async getAllProducts(@User() user: UsersEntity) {
    return await this.productsService.getAllProducts(user);
  }

  @ApiOperation({ summary: "Get product by id" })
  @Get(':id')
  async getProduct(@User() user: UsersEntity, @Param('id') id: number) {
    return await this.productsService.getProduct(user, id);
  }

  @ApiOperation({ summary: "Add new product" })
  @Post('add_product')
  async addProduct(@Body(ValidationPipe) productDto: CreateProductDto,
  @User() user: UsersEntity){
    return await this.productsService.addProduct(productDto, user);
  }

  @ApiOperation({ summary: "Update product" })
  @Patch('update_product/:id')
  async updateProduct(@Body(ValidationPipe) product: updateProductDto,
  @Param("id") id: number,
  @User() user: UsersEntity){
    return await this.productsService.updateProduct(id, product, user);
  }

  @ApiOperation({ summary: "Remove product" })
  @Delete('delete_product/:id')
  async removeProduct(@Param("id") id: number,
  @User() user: UsersEntity){
    return await this.productsService.removeProduct(id, user);
  }

  //apis for carts table
  @ApiOperation({ summary: "Get products in cart" })
  @Get('carts')
  getAllCarts(@User() user: UsersEntity){
    return this.productsService.getAllCarts(user);
  }

  @ApiOperation({ summary: "Add to cart" })
  @Post('add_to_cart/:id')
  async addToCart(@Param("id") id: number,
  @Body(ValidationPipe) product: updateProductDto,
  @User() user: UsersEntity){
    return await this.productsService.addToCart(id, product, user);
  }

  @ApiOperation({ summary: "Remove from cart" })
  @Delete('delete/:id')
  async removeFromCart(@Param("id") id: number,
  @User() user: UsersEntity){
    return await this.productsService.removeFromCart(id, user);
  }

}
