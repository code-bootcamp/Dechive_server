import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Comments } from './entities/comment.entity';
import { CommentsService } from './comment.service';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from 'src/commons/interfaces/context';
import { CreateCommentInput } from './dto/comments-create.input';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService, //
  ) {}
  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Comments)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    return this.commentsService.createComment({
      userid,
      createCommentInput,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentid') commentid: string,
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    const result = await this.commentsService.deleteComment({
      userid,
      commentid,
    });
    return result.affected;
  }
}
