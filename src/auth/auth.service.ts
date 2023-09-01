import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from '../dtos/user-login.dto';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, UpdateAdminDto } from '../dtos/user.dto';
import {
  DATABASE_ERROR_MSG,
  ERROR_MSG,
  JwtPayload,
  ResponseMap,
  SUCCESS_MSG,
  expired,
} from '../utils/constants';
import { UserRoles } from '../utils/enums';
import { omit } from 'lodash';
import { GlobalResponseType } from '../utils/types';
import { CartProductsEntity } from '../products/cart-products.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectRepository(CartProductsEntity)
    private cartProductRepository: Repository<CartProductsEntity>,
    private jwtService: JwtService,
  ) {}

  async loginUser(userLoginDTO: UserLoginDto): GlobalResponseType {
    try {
      const { email, password } = userLoginDTO;

      // User check
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(ERROR_MSG.user_not_found);
      }

      // Password check
      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new BadRequestException(ERROR_MSG.invalid_credential);
      }

      // JWT creation
      const tokenResponse = await this.getUserResponse(user);
      return ResponseMap({ tokenResponse }, SUCCESS_MSG.user_login_success);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserResponse(user: UsersEntity) {
    // Access token generation
    const payload: JwtPayload = {
      email: user.email,
      userId: user.id,
      roles: user.roles,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async registerUser(registerUserDto: RegisterUserDto): GlobalResponseType {
    try {
      const hashed = await bcrypt.hash(registerUserDto.password, 12);

      // Calculate the user's age based on the provided date of birth
      const dob = new Date(registerUserDto.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age = age -1;
      }

      // Check if the user is above 18 years old
      if (age < 18) {
        throw new BadRequestException(ERROR_MSG.invalid_age);
      }

      // Check if already registered
      const foundUser = await this.userRepository.findOne({
        where: { email: registerUserDto.email },
      });
      if (foundUser) {
        throw new BadRequestException(ERROR_MSG.already_registered);
      }

      const user = await this.userRepository.save({
        username: registerUserDto.username,
        password: hashed,
        email: registerUserDto.email,
        gender: registerUserDto.gender,
        dob: registerUserDto.dob,
        address: registerUserDto.address,
      });

      // const { password, ...savedUser } = user;
      return ResponseMap(
        {
          success: true,
        },
        SUCCESS_MSG.user_register_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async googleLogin(req, res) {
    // Redirect to frontend
    // const jwtToken = req.user.google_access_token;
    // res.redirect(`${process.env.FRONTEND_URL}?query=${jwtToken}`);

    const userData = req.user;

    if (!req.user) {
      throw new BadRequestException(ERROR_MSG.user_not_found);
    }

    const user = new UsersEntity();
    user.username = `${userData.firstName}`;
    user.email = userData.email;
    user.password = `Google ${userData.google_access_token}`;
    user.roles = 2;

    // Check if user already exist in database
    const alreadyUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (!alreadyUser) {
      await user.save();
    } else {
      user.id = alreadyUser.id;
    }

    const tokenResponse = await this.getUserResponse(user);

    const resultResponse: Record<string, unknown> = {
      ...tokenResponse,
    };

    res.redirect(`${process.env.FRONTEND_URL}/login?code=${resultResponse.token}`);

    // res
    //   .status(200)
    //   .send(`${process.env.FRONTEND_URL}?query=${resultResponse.token}`);
  }

  async getAllUsers(user: UsersEntity, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const usersQuery = this.userRepository
        .createQueryBuilder('user')
        .where('user.roles != :superAdminRole', {
          superAdminRole: UserRoles.SuperAdmin,
        })
        .andWhere('user.roles != :adminRole', {
          adminRole: UserRoles.ViewerAdmin,
        })
        .take(limit)
        .skip(skip);

      const users = await usersQuery.getMany();

      const totalCount = await usersQuery.getCount();

      const transformedUsers = users.map((user) => omit(user, 'password', 'address', 'dob', 'gender', 'roles'));

      return {
        data: transformedUsers,
        totalCount,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllAdmin(user: UsersEntity, page: number, limit: number){
    try {
      const skip = (page - 1) * limit;

      const usersQuery = this.userRepository
        .createQueryBuilder('user')
        .where('user.roles != :superAdminRole', {
          superAdminRole: UserRoles.SuperAdmin,
        })
        .andWhere('user.roles != :userRole', {
          userRole: UserRoles.Customer,
        })
        .take(limit)
        .skip(skip);

      const admins = await usersQuery.getMany();

      const totalCount = await usersQuery.getCount();

      const transformedAdmins = admins.map((user) => omit(user, 'password', 'roles', 'gender', 'dob', 'address', 'total_purchase', 'total_payment'));

      return {
        data: transformedAdmins,
        totalCount,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(user: UsersEntity): GlobalResponseType {
    const loggedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    const { password, roles, total_payment, total_purchase, ...customer } = loggedUser;

    return ResponseMap({ customer });
  }

  async updateProfile(user: UsersEntity, userData: UpdateAdminDto) {
    const loggedUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!loggedUser) {
      throw new BadRequestException(ERROR_MSG.user_not_found);
    }

    loggedUser.username = userData.username;
    // loggedUser.password = userData.password;
    loggedUser.dob = userData.dob;
    loggedUser.gender = userData.gender;
    loggedUser.address = userData.address;

    const updatedUser = await this.userRepository.update(user.id, loggedUser);

    if (!updatedUser) {
      throw new BadRequestException(DATABASE_ERROR_MSG.profile_not_updated);
    }

    return ResponseMap({ success: true }, SUCCESS_MSG.profile_update_success);
  }

  async addAdmin(adminDto: RegisterUserDto): GlobalResponseType {
    try {
      const hashed = await bcrypt.hash(adminDto.password, 12);

      // Check if already registered
      const foundUser = await this.userRepository.findOne({
        where: { email: adminDto.email, roles: 1 },
      });
      if (foundUser) {
        throw new BadRequestException(ERROR_MSG.already_added_admin);
      }

      const customer = await this.userRepository.findOne({
        where: {email: adminDto.email, roles: 2}
      });
      if(customer){
        throw new BadRequestException(ERROR_MSG.registerd_as_customer);
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

      // const { password, ...savedUser } = admin;
      return ResponseMap(
        {
          success: true,
        },
        SUCCESS_MSG.admin_register_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUser(id: number): GlobalResponseType {
    try {
      // Check if user is active in cart
      const isInCart = await this.cartProductRepository.count({
        where: {
          users: { id },
        },
      });
      if(isInCart>0){
        throw new BadRequestException(ERROR_MSG.active_user);
      }

      const user = await this.userRepository.findOne({where: {id}});        

      const result = await this.userRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(DATABASE_ERROR_MSG.user_delete);
      } else {
        if(user.roles === UserRoles.Customer){
          return ResponseMap(
            {
              success: true,
            },
            SUCCESS_MSG.user_delete_succes,
          );
        }
        if(user.roles === UserRoles.ViewerAdmin){
          return ResponseMap(
            {
              success: true,
            },
            SUCCESS_MSG.admin_delete_success,
          )
        }
        
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAdmin(
    id: number,
    adminDto: UpdateAdminDto,
    user: UsersEntity,
  ): GlobalResponseType {
    try {
      const admin = await this.userRepository.findOne({ where: { id } });

      if (!admin) {
        throw new NotFoundException(ERROR_MSG.admin_not_found);
      }

      admin.id = id;
      admin.username = adminDto.username;
      admin.email = adminDto.email;
      admin.password = adminDto.password;
      admin.address = adminDto.address;
      admin.dob = adminDto.dob;
      admin.gender = adminDto.gender;

      const savedAdmin = await this.userRepository.update(admin.id, admin);
      return ResponseMap(
        {
          success: true,
        },
        SUCCESS_MSG.admin_update_success,
      );
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
