import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRoles } from 'src/user-roles.enum';
import { User } from 'src/user.decorator';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UsersEntity } from './users.entity';
import { UpdateAdminDto } from 'src/dtos/update-admin.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up for users' })
  @Post('register')
  @UsePipes(ValidationPipe)
  registration(@Body() regiUser: RegisterUserDto) {
    return this.authService.registerUser(regiUser);
  }

  @ApiOperation({ summary: 'Sign in for users' })
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() user: UserLoginDto) {
    return this.authService.loginUser(user);
  }

  @ApiOperation({ summary: 'Google login for users' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req) {
    return this.authService.googleLogin(req);
  }

  /**Api for ADMIN only */
  @ApiOperation({ summary: 'Get all users' })
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin, UserRoles.ViewerAdmin) // Restrict to SuperAdmin and Admin role
  async getAllUsers(@User() user: UsersEntity) {
    return await this.authService.getAllUsers(user);
  }

  @ApiOperation({ summary: 'Add Admin' })
  @Post('add_admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async addAdmin(@Body(ValidationPipe) adminDto: RegisterUserDto,
  @User() user: UsersEntity) {
    return await this.authService.addAdmin(adminDto, user);
  }

  @ApiOperation({ summary: 'Remove Admin' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async removeAdmin(@Param('id') id: number){
    return await this.authService.removeAdmin(id);
  }

  @ApiOperation({ summary: 'Update Admin'})
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SuperAdmin) // Restrict to SuperAdmin role
  async updateAdmin(@Body(ValidationPipe) admin: UpdateAdminDto,
  @Param("id") id: number,
  @User() user: UsersEntity){
    return await this.authService.updateAdmin(id, admin, user);
  }
}
