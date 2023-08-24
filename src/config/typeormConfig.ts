import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: 'root',
  password: 'Creole@123',
  database: 'eCommerce_backend',
  autoLoadEntities: true,
  // entities: [],
  synchronize: true,
  // logging: true,
};
