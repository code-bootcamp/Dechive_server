import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateBoardInput } from './dto/board-update.input';
import { Product } from '../products/entities/product.entity';
import { getOpenGraph } from 'src/commons/util/getOpenGraph';
import { OpenGraph } from '../products/dto/openGraph.dto';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  @Query(() => Board)
  fetchBoard(
    @Args('boardid') boardid: string, //
  ) {
    return this.boardsService.findOneBoard({ boardid, isView: true });
  }

  @Query(() => [Board])
  fetchBoards() {
    return this.boardsService.findAllBoards();
  }

  @Query(() => OpenGraph)
  getOpenGraph(
    @Args('url') url: string, //
  ) {
    return getOpenGraph({ url });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => [Board])
  fetchUserBoards(
    @Args('userid') userid: string,
    @Context() context: IContext, //
  ) {
    const { id } = context.req.user;
    return this.boardsService.findUserBoards({ id, userid });
  }

  @Query(() => [Board])
  fetchBestBoards() {
    return this.boardsService.findBestBoards();
  }

  @Query(() => [Product])
  fetchProducts(@Args('userid') userid: string) {
    return this.boardsService.fetchProductsFromOneUser({ userid });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => [Board])
  fetchBoardsUserLiked(
    @Args('userid') userid: string, //
    @Context() context: IContext,
  ) {
    const { id } = context.req.user;
    return this.boardsService.fetchBoardUserLiked({ id, userid });
  }

  @Query(() => [Board])
  searchBoards(
    @Args('keyword') keyword: string, //
  ) {
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
