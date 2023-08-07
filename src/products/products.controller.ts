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
import { CreateProductDto, UpdateProductDto, cartProductDto } from 'src/dtos/product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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


  @ApiOperation({ summary: 'Get all products' })
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Get('product/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getProduct(@User() user: UsersEntity, @Param('id') id: number) {
    return await this.productsService.getProduct(user, id);
  }

  @ApiOperation({ summary: 'Add new product' })
  @Post('add_product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  @UseInterceptors(FileInterceptor('product_img', multerConfig)) // Handle file upload
  async addProduct(
    @Body(ValidationPipe) productDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: UsersEntity,
  ) {    
    return await this.productsService.addProduct(productDto, user, image);
  }

  @ApiOperation({ summary: 'Update product' })
  @Patch('update_product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  @UseInterceptors(FileInterceptor('product_img', multerConfig))
  async updateProduct(
    @Req() req: Request,
    @Body(ValidationPipe) product: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: UsersEntity,
  ) {
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
  async removeProduct(@Param('id') id: number, @User() user: UsersEntity) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async addToCart(
    @Param('id') id: number,
    @Body(ValidationPipe) cartDto: cartProductDto,
    @User() user: UsersEntity,
  ) {
    return await this.productsService.addToCart(id, cartDto, user);
  }

  @ApiOperation({ summary: 'Remove from cart' })
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  async removeFromCart(@Param('id') id: number, @User() user: UsersEntity) {
    return await this.productsService.removeFromCart(id, user);
  }

  @ApiOperation({summary: 'Purchase Product'})
  @Get('purchase/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.Customer) // Restrict to Customer role
  purchaseProduct(@Param('id') id: number,
  @User() user: UsersEntity){
    return this.productsService.purchaseProduct(id, user);
  }
}
