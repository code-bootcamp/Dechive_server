import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guards';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateBoardInput } from './dto/board-update.input';
import { DeleteResult } from 'typeorm';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => String)
  fetchBoard() {
    return 'test';
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('boardId') boardId: string, //
    @Context() context: IContext,
  ) {
    const { id } = context.req.user;
    await this.boardsService.deleteBoard({
      id,
      boardId,
    });
    return true;
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context() context: IContext,
  ): Promise<Board> {
    const { id } = context.req.user;
    return this.boardsService.createBoard({
      createBoardInput,
      // files,
      id,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  async updateBoard(
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    @Args('boardId') boardId: string,
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context() context: IContext,
  ): Promise<Board> {
    const { id } = context.req.user;
    return this.boardsService.updateBoard({
      updateBoardInput,
      boardId,
      id,
      // files,
    });
  }
}
