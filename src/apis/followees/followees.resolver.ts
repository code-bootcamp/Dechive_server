import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FetchFollowees } from './dto/followee-fetch.input';
import { FolloweesService } from './followees.service';

@Resolver()
export class FolloweesResolver {
  constructor(
    private readonly followeesService: FolloweesService, //
  ) {}

  @Query(() => [User])
  fetchFollowees(
    @Args('FetchFollowees') fetchFollowees: FetchFollowees, //
  ): Promise<User[]> {
    const { userid, loginUserid: guestid } = fetchFollowees;
    return this.followeesService.fetchFollowees({ id: userid, guestid });
  }
}
