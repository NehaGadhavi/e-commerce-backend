import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../auth/users.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtCustomStrategy } from './jwt-custom-strategy';
import { GoogleStrategy } from './google.strategy';
import { CartProductsEntity } from '../products/cart-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, CartProductsEntity]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        algorithm: 'HS512',
        expiresIn: '1d',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
  ],
  providers: [AuthService, jwtCustomStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [PassportModule, jwtCustomStrategy],
})
export class AuthModule {}
