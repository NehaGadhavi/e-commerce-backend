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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UsersEntity } from 'src/auth/users.entity';
import { User } from 'src/user.decorator';
import {
  CreateProductDto,
  UpdateProductDto,
  cartProductDto,
} from 'src/dtos/product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/multer.config';
import { UserRoles } from 'src/utils/enums';
import { Request, Response } from 'express';
import { GlobalResponseType } from 'src/utils/types';
import { ShippingDetailsDto } from 'src/dtos/shipping-details.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Get all products' })
  @Get('all')
  async getAllProducts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('category') categoty: number = null,
    @Query('sortOrder') sortOrder: 'asc' | 'desc',
  ) {
    return await this.productsService.getAllProducts(page, limit, categoty, sortOrder);
  }

  @ApiOperation({ summary: 'Search products' })
  @Get('search_text')
  async searchText(@Req() req: Request) {
    return await this.productsService.searchText(req);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @Get('product/:id')
  async getProduct(@Param('id') id: number) {
    return await this.productsService.getProduct(id);
  }

  @ApiOperation({ summary: 'Add new product' })
  @Post('add_product')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  @UseInterceptors(FileInterceptor('product_img', multerConfig)) // Handle file upload
  async addProduct(
    @Body() productDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: UsersEntity,
  ): GlobalResponseType {
    return await this.productsService.addProduct(productDto, user, image);
  }

  @ApiOperation({ summary: 'Update product' })
  @Patch('update_product/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  @UseInterceptors(FileInterceptor('product_img', multerConfig))
  async updateProduct(
    @Req() req: Request,
    @Body() product: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: UsersEntity,
  ): GlobalResponseType {
    return await this.productsService.updateProduct(
      Number(req.params.id),
      product,
      user,
      image,
    );
  }

  @ApiOperation({ summary: 'Remove product' })
  @Delete('delete_product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async removeProduct(
    @Param('id') id: number,
    @User() user: UsersEntity,
  ): GlobalResponseType {
    return await this.productsService.removeProduct(id, user);
  }

  /**Api for CART PRODUCTS */

  @ApiOperation({ summary: 'Get products in cart' })
  @Get('carts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async getAllCarts(@User() user: UsersEntity) {
    return await this.productsService.getAllCarts(user);
  }

  @ApiOperation({ summary: 'Add to cart' })
  @Post('add_to_cart/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async addToCart(
    @Param('id') id: number,
    @Body() cartDto: cartProductDto,
    @User() user: UsersEntity,
  ): GlobalResponseType {
    return await this.productsService.addToCart(id, cartDto, user);
  }

  @ApiOperation({ summary: 'Remove from cart' })
  @Delete('remove_from_cart/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async removeFromCart(
    @Param('id') id: number,
    @User() user: UsersEntity,
  ): GlobalResponseType {
    return await this.productsService.removeFromCart(id, user);
  }

  // @ApiOperation({ summary: 'Purchase Product' })
  // @Patch('purchase')
  // @UsePipes(ValidationPipe)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.Customer) // Restrict to Customer role
  // async purchaseProduct(
  //   @User() user: UsersEntity,
  // ): GlobalResponseType {
  //   return await this.productsService.purchaseProduct(user);
  // }

  @ApiOperation({ summary: 'Update Quantity from cart' })
  @Patch('update_quantity/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin, UserRoles.Customer)
  async updateQuantity(
    @Param('id') id: number,
    @Body('quantity') quantity: number,
  ) {
    return await this.productsService.updateQuantity(id, quantity);
  }

  @ApiOperation({ summary: 'Shipping Details' })
  @Post('shipping_details')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async saveShippingDetails(@User() user: UsersEntity,
  @Body() shippingDto: ShippingDetailsDto){
    return await this.productsService.saveShippingDetails(user, shippingDto);
  }
}
