import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { DechiveAuthGuard } from '../auth/guards/auth.guard';
import { MatchAuthInput } from './dto/matchAuth.Input';
import { ResetPasswordInput } from './dto/resetPassword.Input';
import { CreateUserInput } from './dto/user-create.input';
import { FetchUser } from './dto/user-fetch.return-type';
import { UpdateUserInput } from './dto/user-update.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Query(() => FetchUser)
  fetchUser(@Args('userid') userid: string): Promise<FetchUser> {
    return this.usersService.fetchUser({ id: userid });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext): Promise<User> {
    return this.usersService.findOneUser({ id: context.req.user.id });
  }

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ): Promise<User> {
    return this.usersService.createUser({ createUserInput });
  }

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
    @Context() context: IContext, //
  ): Promise<User> {
    const { id } = context.req.user;
    return this.usersService.updateUser({ updateUserInput, id });
  }

  @Mutation(() => Boolean)
  authEmail(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.authEmail({ email, qqq: true });
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

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Boolean)
  deleteUser(
    @Context() context: IContext, //
  ): Promise<boolean> {
    const { id } = context.req.user;
    return this.usersService.deleteUser({ id });
  }
}
