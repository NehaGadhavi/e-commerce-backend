import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dtos/user-login.dto';
import { RegisterUserDto } from 'src/dtos/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @ApiOperation({ summary: "Sign up for users" })
    @Post('register')
    @UsePipes(ValidationPipe)
    registration(@Body() regiUser: RegisterUserDto) {
        return this.authService.registerUser(regiUser);
    }

    @ApiOperation({ summary: "Sign in for users" })
    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() user: UserLoginDto) {
        return this.authService.loginUser(user);
    }

    @ApiOperation({ summary: "Google login for users" })
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin(@Req() req) { }
    
    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async callback(@Req() req) {
        return this.authService.googleLogin(req);
    }
}
