import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from '../boards/boards.module';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { UsersMoulde } from '../users/users.module';
@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Product, //
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
  ],
  exports: [
    ProductsService, //
  ],
})
export class ProductsModule {}
