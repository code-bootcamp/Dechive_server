import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FolloweesService } from './followees.service';

@Resolver()
export class FolloweesResolver {
  constructor(
    private readonly followeesService: FolloweesService, //
  ) {}

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => [User])
  fetchFollowees(
    @Args('userid') userid: string, //
    @Context() context: IContext,
  ): Promise<User[]> {
    const guestid = context.req.user.id;
    return this.followeesService.fetchFollowees({ id: userid, guestid });
  }
}
