import { Module } from '@nestjs/common';
import { CommentsResolver } from './comment.resolver';
import { CommentsService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from './entities/comment.entity';
import { BoardsModule } from '../boards/boards.module';
@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forFeature([
      Comments, //
    ]),
  ],
  providers: [
    CommentsResolver, //
    CommentsService,
  ],
  exports: [
    CommentsService, //
  ],
})
export class CommentsModule {}
