import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FetchFollowings } from './dto/following-fetch.input';
import { Following } from './entities/followings.entity';
import { FollowingsService } from './following.service';

@Resolver()
export class FollowingsResolver {
  constructor(
    private readonly followingsService: FollowingsService, //
  ) {}

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  updateFollowing(
    @Args('followingid') followingid: string, //
    @Context() context: IContext,
  ): Promise<boolean> {
    const { id } = context.req.user;
    return this.followingsService.updateFollowing({ id, followingid });
  }

  @Query(() => [User])
  fetchFollowings(
    @Args('FetchFollowings') fetchFollowings: FetchFollowings, //
  ): Promise<User[]> {
    const { userid, loginUserid: guestid } = fetchFollowings;

    return this.followingsService.fetchFollowings({ id: userid, guestid });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => [User])
  fetchFollowingBoards(
    @Context() context: IContext, //
  ): Promise<User[]> {
    const { id } = context.req.user;
    return this.followingsService.fetchFollowingBoards({ id });
  }
}
