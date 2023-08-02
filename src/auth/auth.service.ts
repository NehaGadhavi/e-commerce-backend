import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/dtos/user-login.dto';
import { UsersEntity } from 'src/auth/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { JwtExePayload, ResponseMap, expired } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async loginUser(userLoginDTO: UserLoginDto) {
    const { email, password } = userLoginDTO;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    const userId = user.id;
    const roles = user.roles;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const jwtPayload = { email, userId, roles }; // added token details
      const jwtToken = await this.jwtService.signAsync(jwtPayload, {
        expiresIn: '1d',
        algorithm: 'HS512',
      });
      return { data: { token: jwtToken } };
    } else {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const hashed = await bcrypt.hash(registerUserDto.password, 12);

      const foundUser = await this.userRepository.findOne({
        where: { email: registerUserDto.email },
      });

      if (foundUser) {
        throw new BadRequestException('Username already taken.');
      }

      const user = await this.userRepository.save({
        username: registerUserDto.username,
        password: hashed,
        email: registerUserDto.email,
      });

      const { password, ...savedUser } = user;
      return { data: savedUser };
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async googleLogin(req) {
    const userData = req.user;
    if (!req.user) {
      throw new BadRequestException('No user found');
    }

    const user = new UsersEntity();
    user.username = `${userData.firstName}`;
    user.email = userData.email;
    user.password = `Google ${userData.google_access_token}`;
    user.roles = 2;

    // check if user already exist in databse
    const alreadyUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (!alreadyUser) {
      await user.save();
    } else {
      user.id = alreadyUser.id;
    }

    const tokenResponse = await this.getUsersResponse(user);

    const resultResponse: Record<string, unknown> = {
      ...tokenResponse,
      user: user,
    };
    return ResponseMap(resultResponse);
  }

  async getUsersResponse(user: UsersEntity) {
    console.log(user);
    // Access Token Generation
    const payload: JwtExePayload = {
      created_by: user.email,
      id: user.id,
    };

    let access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      expires: expired,
    };
  }
}
