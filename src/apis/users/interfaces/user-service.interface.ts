import { IAuthUser, IContext } from 'src/commons/interfaces/context';
import { MatchAuthInput } from '../dto/matchAuth.Input';
import { ResetPasswordInput } from '../dto/resetPassword.Input';
import { CreateUserInput } from '../dto/user-create.input';
import { UpdateUserInput } from '../dto/user-update.input';
import { User } from '../entities/user.entity';

export interface IUsersServiceCreateUser {
  createUserInput: CreateUserInput;
}
export interface IUsersServiceFindOneEmail {
  email: User['email'];
}

export interface IUsersServiceIsEmail {
  email: User['email'];
}

export interface IUsersServiceHashPassword {
  password: User['password'];
}

export interface IUsersServiceUpdateUser {
  updateUserInput: UpdateUserInput;
  id: User['id'];
}

export interface IUsersServiceFindeOne {
  id: User['id'];
}

export interface IUsersServiceAuthEamil {
  email: User['email'];
}

export interface IUsersServiceMathAuth {
  matchAuthInput: MatchAuthInput;
}

export interface IUsersServiceResetPassword {
  resetPasswordInput: ResetPasswordInput;
}
