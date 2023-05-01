import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from '../boards/boards.module';
import { Reply } from './entities/reply.entity';
import { RepliesResolver } from './reply.resolver';
import { RepliesService } from './reply.service';
import { CommentsModule } from '../comments/comment.module';
@Module({
  imports: [
    BoardsModule,
    CommentsModule,
    TypeOrmModule.forFeature([
      Reply, //
    ]),
  ],
  providers: [
    RepliesResolver, //
    RepliesService,
  ],
  exports: [
    RepliesService, //
  ],
})
export class RepliesModule {}
