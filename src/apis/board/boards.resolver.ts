import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class BoardsResolver {
  @Query(() => String)
  fetchUsers() {
    return 'a';
  }
}
