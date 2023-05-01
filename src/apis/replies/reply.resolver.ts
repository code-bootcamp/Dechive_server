import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { IContext } from 'src/commons/interfaces/context';
import { Reply } from './entities/reply.entity';
import { RepliesService } from './reply.service';
import { CreateReplyInput } from './dto/reply-create.input';

@Resolver()
export class RepliesResolver {
  constructor(
    private readonly RepliesService: RepliesService, //
  ) {}

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Reply)
  async createReply(
    @Args('createReplyInput') createReplyInput: CreateReplyInput,
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    return this.RepliesService.createReply({
      userid,
      createReplyInput,
    });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteReply(
    @Args('replyid') replyid: string,
    @Context() context: IContext,
  ) {
    const userid = context.req.user.id;
    const result = await this.RepliesService.deleteReply({
      userid,
      replyid,
    });
    return result.affected === 1;
  }
}
