import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateBoardInput } from './dto/board-update.input';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => Board)
  fetchBoard(
    @Args('boardid') boardid: string, //
  ) {
    return this.boardsService.findOneBoard({ boardid });
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
    @Args('boardid') boardid: string, //
  ) {
    return this.boardsService.fetchOneViewCount({
      boardid,
    });
  }

  @Query(() => [Board])
  searchBoard(
    @Args('keyword') keyword: string, //
  ) {
    return this.boardsService.searchBoard({
      keyword,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Context() context: IContext,
  ): Promise<Board> {
    const userid = context.req.user.id;
    return this.boardsService.createBoard({
      createBoardInput,
      userid,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  async updateBoard(
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    @Args('boardid') boardid: string,
    @Context() context: IContext,
  ): Promise<Board> {
    const userid = context.req.user.id;
    return this.boardsService.updateBoard({
      updateBoardInput,
      boardid,
      userid,
    });
  }

  @Mutation(() => Boolean)
  async test(@Args('a') a: string) {
    const ab = await this.boardsService.test({ storageDelet: a });
    console.log(ab);
    return true;
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('boardid') boardid: string, //
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    await this.boardsService.deleteBoard({
      userid,
      boardid,
    });
    return true;
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  updateBoardLiker(
    @Args('boardid') boardid: string, //
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    return this.boardsService.updateBoardLiker({
      userid,
      boardid,
    });
  }
}
