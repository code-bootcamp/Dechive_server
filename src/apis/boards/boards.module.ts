import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { HashtagsService } from '../hashtags/hashtags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Board, //
      Hashtag,
      Product,
    ]),
  ],
  providers: [
    BoardsResolver, //
    BoardsService,
    HashtagsService,
    ProductsService,
  ],
  exports: [
    BoardsService, //
  ],
})
export class BoardsModule {}
