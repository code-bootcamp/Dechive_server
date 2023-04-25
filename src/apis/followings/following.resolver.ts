import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FetchFollowing } from './dto/followings-fetch.return-type';
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

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => FetchFollowing)
  fetchFollowings(
    @Args('userid') userid: string, //
    @Context() context: IContext,
  ): Promise<FetchFollowing> {
    const guestid = context.req.user.id;
    return this.followingsService.fetchFollowings({ id: userid, guestid });
  }
}
