import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/user.decorator';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

}
