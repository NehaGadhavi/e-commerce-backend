import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/user-roles.enum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>){}

    async getAllProducts(user: UsersEntity){
        if (user.roles == UserRoles.SuperAdmin) {
            try {
                return await this.usersRepository.find();
            } catch (err) {
                throw new NotFoundException('No products found');
            }
        } else {
            const query = await this.usersRepository.createQueryBuilder('products');

            query.where(`products.purchasedById = :purchasedById`, { purchasedById: user.id });

            try {
                return await query.getMany();
            } catch (err) {
                throw new NotFoundException('No products found');
            }
        }
    }
}
