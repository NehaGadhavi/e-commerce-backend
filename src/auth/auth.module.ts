import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/auth/users.entity';
import { PassportModule } from '@nestjs/passport';
import { jwtCustomStrategy } from './jwt-custom-strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register({
      secret: 'sdwe4DFSD3sasweftyjab',
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
