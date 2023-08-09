import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './products.entity';
import { CartProductsEntity } from './cart-products.entity';
import { UsersEntity } from 'src/auth/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsEntity, CartProductsEntity, UsersEntity]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
