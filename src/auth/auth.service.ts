import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from 'src/dtos/user-login.dto';
import { UsersEntity } from 'src/auth/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from 'src/dtos/register-user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,){}

    async loginUser(userLoginDTO: UserLoginDto){
        console.log(userLoginDTO);
        const { username, password } = userLoginDTO;

        const user = await this.userRepository.findOne({
            where: { username }
        });
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        const userId = user.id;
        const roles = user.roles;

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (isPasswordMatch) {
            const jwtPayload = { username, userId, roles }; //added token details
            const jwtToken = await this.jwtService.signAsync(jwtPayload, { expiresIn: '1d', algorithm: 'HS512' });
            return { token: jwtToken };
        } else {
            throw new UnauthorizedException('Invalid credentials.');
        }
    }

    async registerUser(registerUserDto: RegisterUserDto){
        const { username, password, email } = registerUserDto;
        const hashed = await bcrypt.hash(password, 12);

        const foundUser = await this.userRepository.findOne({ where: { email } });

        if (foundUser) {
            throw new BadRequestException('Username already taken.')
        } else {
            const user = new UsersEntity();
            user.username = username;
            user.password = hashed;
            user.email = email;

            this.userRepository.create(user);


            try {
                return await this.userRepository.save(user);
            } catch (err) {
                throw new InternalServerErrorException('Something went wrong, user was not created.');
            }
        }
    }

    googleLogin(req){
        if(!req.user){
            return 'Not authenticated from google!';
        } else{
            return {
                message: "User information",
                user: req.user
            }
        }
    }
}
