import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/user-roles.enum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>){}
}
