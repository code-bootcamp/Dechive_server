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

  @Query(() => Board)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.findOneBoard({ boardId });
  }

  @Query(() => [Board])
  fetchBoards() {
    return this.boardsService.findAllBoards();
  }

  @Query(() => [Board])
  fetchBestBoards() {
    return this.boardsService.findAllBoards();
  }

  @Query(() => Board)
  viewBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.fetchOneViewCount({
      boardId,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context() context: IContext,
  ): Promise<Board> {
    const userId = context.req.user.id;
    return this.boardsService.createBoard({
      createBoardInput,
      // files,
      userId,
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
    const userId = context.req.user.id;
    return this.boardsService.updateBoard({
      updateBoardInput,
      boardId,
      userId,
      // files,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('boardId') boardId: string, //
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    await this.boardsService.deleteBoard({
      userId,
      boardId,
    });
    return true;
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  updateBoardLiker(
    @Args('boardId') boardId: string, //
    @Context() context: IContext,
  ) {
    const userId = context.req.user.id;
    return this.boardsService.updateBoardLiker({
      userId,
      boardId,
    });
  }
}
