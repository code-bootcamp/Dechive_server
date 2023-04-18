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
      Board, //레포 imports 최소화 필요
      Hashtag,
      Product,
      // Picture,
    ]),
  ],
  providers: [
    BoardsResolver, //
    BoardsService,
    HashtagsService,
    ProductsService,
    // PicturesService,
  ],
  exports: [
    BoardsService, //
  ],
})
export class BoardsModule {}
