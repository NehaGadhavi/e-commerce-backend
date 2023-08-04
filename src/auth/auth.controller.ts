import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dtos/user-login.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { User } from 'src/user.decorator';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UsersEntity } from './users.entity';
import { UpdateAdminDto } from 'src/dtos/update-admin.dto';
import { UserRoles } from 'src/utils/enums';
import { API } from 'src/utils/swagger.constants';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @param registerUserData name, email, password, roles, dob, gender, address of user
   * @returns user data
   */
  // ANCHOR - SIGN UP
  @ApiOperation({ summary: 'Sign up for users' })
  @Post('register')
  @UsePipes(ValidationPipe)
  registration(@Body() registerUserData: RegisterUserDto) {
    return this.authService.registerUser(registerUserData);
  }

  /**
   *
   * @param loginData email and password of user
   * @returns token
   */
  // ANCHOR - LOGIN
  @ApiOperation({ summary: 'Sign in for users' })
  @ApiResponse({ ...API.BAD_REQUEST })
  @ApiResponse({ ...API.OK })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  login(@Body() loginData: UserLoginDto) {
    return this.authService.loginUser(loginData);
  }

  @ApiOperation({ summary: 'Google login for users' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {}

  @ApiOperation({ summary: 'Callback api of google' })
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin, UserRoles.ViewerAdmin) // Restrict to SuperAdmin and Admin role
  async getAllUsers(@User() user: UsersEntity) {
    return await this.authService.getAllUsers(user);
  }

  /**
   *
   * @param adminDto name, email, password, roles, dob, gender, address for admin
   * @returns admin data
   */
  // ANCHOR - ADD ADMIN
  @ApiOperation({ summary: 'Add Admin' })
  @Post('add_admin')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async addAdmin(
    @Body(ValidationPipe) adminDto: RegisterUserDto,
    @User() user: UsersEntity,
  ) {
    return await this.authService.addAdmin(adminDto, user);
  }

  /**
   *
   * @param id of admin
   * @returns success message
   */
  // ANCHOR - REMOVE ADMIN
  @ApiOperation({ summary: 'Remove Admin' })
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async removeAdmin(@Param('id') id: number) {
    return await this.authService.removeAdmin(id);
  }

  /**
   *
   * @param admin data to update for admin
   * @returns updated admin data
   */
  // ANCHOR - ADD ADMIN
  @ApiOperation({ summary: 'Update Admin' })
  @Patch('update/:id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async updateAdmin(
    @Body(ValidationPipe) admin: UpdateAdminDto,
    @Param('id') id: number,
    @User() user: UsersEntity,
  ) {
    return await this.authService.updateAdmin(id, admin, user);
  }
}
