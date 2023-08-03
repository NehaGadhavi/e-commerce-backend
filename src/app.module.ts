import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeormConfig';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { multerConfig } from './multer/multer.config';
import { ServeStaticModule } from '@nestjs/serve-static';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ProductsModule,
    AuthModule,
    MulterModule.register(multerConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'], // Exclude API routes from static serving
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
