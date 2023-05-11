import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { UsersMoulde } from '../users/users.module';
import { Picture } from '../pictures/entities/picture.entity';
import { PicturesService } from '../pictures/pictures.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    UsersMoulde,
    ProductsModule,
    TypeOrmModule.forFeature([
      Board, //
      Hashtag,
      Picture,
    ]),
  ],
  providers: [
    BoardsResolver, //
    BoardsService,
    HashtagsService,
    PicturesService,
  ],
  exports: [
    BoardsService, //
  ],
})
export class BoardsModule {}
