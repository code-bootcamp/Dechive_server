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
import { CommentsService } from '../comments/comment.service';
import { Comments } from '../comments/entities/comment.entity';
import { Reply } from '../Replies/entities/reply.entity';
import { RepliesService } from '../Replies/reply.service';

@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Board, //레포 imports 최소화 필요
      Comments,
      Hashtag,
      Product,
      Reply,
    ]),
  ],
  providers: [
    BoardsResolver, //
    BoardsService,
    CommentsService,
    HashtagsService,
    ProductsService,
    RepliesService,
  ],
  exports: [
    BoardsService, //
  ],
})
export class BoardsModule {}
