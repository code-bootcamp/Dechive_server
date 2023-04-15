import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MatchAuthInput } from './dto/matchAuth.Input';
import { ResetPasswordInput } from './dto/resetPassword.Input';
import { CreateUserInput } from './dto/user-create.input';
import { UpdateUserInput } from './dto/user-update.input';
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

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ): Promise<User> {
    return this.usersService.updateUser({ updateUserInput });
  }

  @Mutation(() => Boolean)
  authEmail(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.authEmail({ email });
  }

  @Mutation(() => Boolean)
  matchAuthNumber(
    @Args('matchAuthInput') matchAuthInput: MatchAuthInput, //
  ): Promise<boolean> {
    return this.usersService.matchAuthNumber({ matchAuthInput });
  }

  @Mutation(() => Boolean)
  resetUserPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput, //
  ): Promise<boolean> {
    return this.usersService.resetUserPassword({ resetPasswordInput });
  }
}
