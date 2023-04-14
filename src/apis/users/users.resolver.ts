import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/user-create.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ): Promise<User> {
    return this.usersService.createUser({ createUserInput });
  }
}
