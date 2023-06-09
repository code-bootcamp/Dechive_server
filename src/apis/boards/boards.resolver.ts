import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateBoardInput } from './dto/board-update.input';
import { getOpenGraph } from 'src/commons/util/getOpenGraph';
import { OpenGraph } from '../products/dto/opengraph.return-type';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => Board)
  fetchBoard(
    @Args('userid') userid: string, //아무의미없는 값, 좋아요 여부는 프론트에서 판단
    @Args('boardid') boardid: string, //
  ): Promise<Board> {
    return this.boardsService.findOneBoard({
      boardid,
      isView: true,
    });
  }

  @Query(() => [Board])
  fetchBoards(
    @Args('userid') userid: string, //
  ): Promise<Board[]> {
    return this.boardsService.findAllBoards({ userid });
  }

  @Query(() => OpenGraph)
  getOpenGraph(
    @Args('url') url: string, //
  ): Promise<OpenGraph> {
    return getOpenGraph({ url });
  }

  @Query(() => [Board])
  fetchUserBoards(
    @Args('userid') userid: string, //
    @Args('searchid') searchid: string,
  ): Promise<Board[]> {
    return this.boardsService.findUserBoards({ searchid, userid });
  }

  @Query(() => [Board])
  fetchTop10(
    @Args('userid') userid: string, //
  ): Promise<Board[]> {
    return this.boardsService.findTop10({ userid });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => [Board])
  fetchBoardsUserLiked(
    @Context() context: IContext, //
  ): Promise<Board[]> {
    const { id } = context.req.user;
    return this.boardsService.findBoardUserLiked({ id });
  }

  @Query(() => [Board])
  searchBoards(
    @Args('keyword') keyword: string, //
  ): Promise<Board[]> {
    return this.boardsService.searchBoards({
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

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteBoard(
    @Args('boardid') boardid: string, //
    @Context() context: IContext,
  ): Promise<boolean> {
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
  ): Promise<boolean> {
    const userid = context.req.user.id;
    return this.boardsService.updateBoardLiker({
      userid,
      boardid,
    });
  }
}
