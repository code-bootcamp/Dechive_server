import { Args, Resolver, Query } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { FolloweesService } from './followees.service';

@Resolver()
export class FolloweesResolver {
  constructor(
    private readonly followeesService: FolloweesService, //
  ) {}

  @Query(() => [User])
  fetchFollowees(
    @Args('userid') userid: string, //
  ): Promise<User[]> {
    return this.followeesService.fetchFollowees({ id: userid });
  }
}
