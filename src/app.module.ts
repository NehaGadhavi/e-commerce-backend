import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeormConfig';
import { UsersController } from './users/users/users.controller';
import { UsersModule } from './users/users/users.module';
import { ProductsController } from './products/products/products.controller';
import { ProductsModule } from './products/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController, UsersController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
