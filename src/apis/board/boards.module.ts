import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';

@Module({
  imports: [],
  providers: [
    BoardsResolver,
    // BoardsService,
  ],
})
export class BoardsModule {}
