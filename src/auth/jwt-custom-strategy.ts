import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersEntity } from '../auth/users.entity';
import { ERROR_MSG } from '../utils/constants';
import { Repository } from 'typeorm';

export class jwtCustomStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload) {
    try {

      const user = await this.userRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new UnauthorizedException(ERROR_MSG.unauthorized_error);
      }

      return user;
    } catch (error) {
      console.log('JWT validate() Error.');
    }
  }
}
