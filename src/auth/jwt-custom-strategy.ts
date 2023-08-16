import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersEntity } from '../auth/users.entity';
import { ERROR_MSG } from '../utils/constants';
import { Repository } from 'typeorm';

export class jwtCustomStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'sdwe4DFSD3sasweftyjab',
    });
  }

  async validate(payload) {
    const { email } = payload;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MSG.unauthorized_error);
    }

    return user;
  }
}
