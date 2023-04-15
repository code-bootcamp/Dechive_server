import { MatchAuthInput } from '../dto/matchAuth.Input';
import { CreateUserInput } from '../dto/user-create.input';
import { UpdateUserInput } from '../dto/user-update.input';
import { User } from '../entities/user.entity';

export interface IUsersServiceCreateUser {
  createUserInput: CreateUserInput;
}
export interface IUsersServiceFindOneEmail {
  email: User['email'];
}

export interface IUsersServiceHashPassword {
  password: User['password'];
}

export interface IUsersServiceUpdateUser {
  updateUserInput: UpdateUserInput;
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
