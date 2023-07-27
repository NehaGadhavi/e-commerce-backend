import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Creole@123',
    database: 'eCommerce_backend',
    autoLoadEntities: true,
    // entities: [],
    synchronize: true,
    // logging: true,
};