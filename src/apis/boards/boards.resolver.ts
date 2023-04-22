import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guards';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateBoardInput } from './dto/board-update.input';
import { DeleteResult } from 'typeorm';
import { CreateCommentInput } from '../comments/dto/comment-create.input';
import { Comments } from '../comments/entities/comment.entity';
// import { FileUpload, GraphQLUpload } from 'graphql-upload';

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

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context() context: IContext,
  ): Promise<Board> {
    const userid = context.req.user.id;
    return this.boardsService.createBoard({
      createBoardInput,
      // files,
      userid,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  async updateBoard(
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
    @Args('boardid') boardid: string,
    // @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Context() context: IContext,
  ): Promise<Board> {
    const userid = context.req.user.id;
    return this.boardsService.updateBoard({
      updateBoardInput,
      boardid,
      userid,
      // files,
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

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Comments)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput, //
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    return this.boardsService.createComment({
      userid,
      createCommentInput,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentid') commentid: string, //
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    const result = await this.boardsService.deleteComment({
      userid,
      commentid,
    });
    return result.affected === 1;
  }
}
