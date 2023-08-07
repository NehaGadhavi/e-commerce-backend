import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/dtos/user-login.dto';
import { UsersEntity } from 'src/auth/users.entity';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, UpdateAdminDto } from 'src/dtos/user.dto';
import { JwtExePayload, ResponseMap, expired } from 'src/utils/constants';
import { UserRoles } from 'src/utils/enums';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async loginUser(userLoginDTO: UserLoginDto) {
    try {
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
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        gender: registerUserDto.gender,
        dob: registerUserDto.dob,
        address: registerUserDto.address,
      });

      const { password, ...savedUser } = user;
      return { data: savedUser };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
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

  async getAllUsers(user: UsersEntity) {
    try {
      const users = await this.userRepository.find();
      return { users: users };
      // let users;

      // if (user.roles === UserRoles.SuperAdmin) {
      //   users = await this.userRepository.find();
      // }
      // if (user.roles === UserRoles.ViewerAdmin) {
      //   users = await this.userRepository.find({
      //     where: {
      //       roles: Not(UserRoles.SuperAdmin),
      //     },
      //   });
      // }

      // const transformedUsers = users.map((user) => omit(user, 'password'));

      // return { data: transformedUsers };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addAdmin(adminDto: RegisterUserDto, user: UsersEntity) {
    try {
      const hashed = await bcrypt.hash(adminDto.password, 12);

      const foundUser = await this.userRepository.findOne({
        where: { email: adminDto.email },
      });

      if (foundUser) {
        throw new BadRequestException('Username already taken.');
      }

      const admin = await this.userRepository.save({
        username: adminDto.username,
        password: hashed,
        email: adminDto.email,
        gender: adminDto.gender,
        dob: adminDto.dob,
        address: adminDto.address,
        roles: UserRoles.ViewerAdmin,
      });

      const { password, ...savedUser } = admin;
      return { data: savedUser };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUser(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (user.roles === UserRoles.SuperAdmin) {
        throw new BadRequestException('Super Admin cannot be deleted!');
      }

      const result = await this.userRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException('User not removed!');
      } else {
        return { success: true };
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAdmin(id: number, adminDto: UpdateAdminDto, user: UsersEntity) {
    try {
      const admin = await this.userRepository.findOne({ where: { id } });

      if (!admin) {
        throw new NotFoundException('Admin not found!');
      }

      Object.keys(adminDto).forEach((key) => {
        if (adminDto[key] !== undefined) {
          admin[key] = adminDto[key];
        }
      });

      // console.log(admin);

      const savedAdmin = await this.userRepository.save(admin);
      return { data: savedAdmin };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
