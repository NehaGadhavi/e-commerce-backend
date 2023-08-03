import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UsersEntity } from 'src/auth/users.entity';
import { User } from 'src/user.decorator';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { updateProductDto } from 'src/dtos/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/multer.config';
import { UserRoles } from 'src/utils/enums';
import { Request, Response } from 'express';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  /**Api for ALL PRODUCTS */
  @ApiOperation({ summary: 'Get all products' })
  @Get('all')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllProducts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.productsService.getAllProducts(page, limit);
  }

  @ApiOperation({ summary: 'Search products' })
  @Get('search_text')
  async searchText(@Req() req: Request) {
    return await this.productsService.searchText(req);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getProduct(@User() user: UsersEntity, @Param('id') id: number) {
    return await this.productsService.getProduct(user, id);
  }

  @ApiOperation({ summary: 'Add new product' })
  @Post('add_product')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  @UseInterceptors(FileInterceptor('product_img', multerConfig)) // Handle file upload
  async addProduct(
    @Body() productDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: UsersEntity,
  ) {
    console.log(image);
    return await this.productsService.addProduct(productDto, user, image);
  }

  @ApiOperation({ summary: 'Update product' })
  @Patch('update_product/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async updateProduct(
    @Body(ValidationPipe) product: updateProductDto,
    @Param('id') id: number,
    @User() user: UsersEntity,
  ) {
    return await this.productsService.updateProduct(id, product, user);
  }

  @ApiOperation({ summary: 'Remove product' })
  @Delete('delete_product/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async removeProduct(@Param('id') id: number, @User() user: UsersEntity) {
    return await this.productsService.removeProduct(id, user);
  }

  /**Api for CART PRODUCTS */
  @ApiOperation({ summary: 'Get products in cart' })
  @Get('carts')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.Customer) // Restrict to Customer role
  getAllCarts(@User() user: UsersEntity) {
    return this.productsService.getAllCarts(user);
  }

  @ApiOperation({ summary: 'Add to cart' })
  @Post('add_to_cart/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.Customer) // Restrict to Customer role
  async addToCart(
    @Param('id') id: number,
    @Body(ValidationPipe) product: updateProductDto,
    @User() user: UsersEntity,
  ) {
    return await this.productsService.addToCart(id, product, user);
  }

  @ApiOperation({ summary: 'Remove from cart' })
  @Delete('delete/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.Customer) // Restrict to Customer role
  async removeFromCart(@Param('id') id: number, @User() user: UsersEntity) {
    return await this.productsService.removeFromCart(id, user);
  }
}
