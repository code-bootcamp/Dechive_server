import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { HashtagsService } from '../hashtags/hashtags.service';
import { UsersMoulde } from '../users/users.module';
import { Picture } from '../pictures/entities/picture.entity';
import { PicturesService } from '../pictures/pictures.service';

@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Board, //
      Hashtag,
      Picture,
      Product,
    ]),
  ],
  providers: [
    BoardsResolver, //
    BoardsService,
    HashtagsService,
    PicturesService,
    ProductsService,
  ],
  exports: [
    BoardsService, //
  ],
})
export class BoardsModule {}
