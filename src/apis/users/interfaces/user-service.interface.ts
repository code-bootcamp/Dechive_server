import { Following } from 'src/apis/followings/entities/followings.entity';
import { MatchAuthInput } from '../dto/matchAuth.Input';
import { ResetPasswordInput } from '../dto/resetPassword.Input';
import { CreateUserInput } from '../dto/user-create.input';
import { FetchUserInput } from '../dto/user-fetch.return-type';
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

export interface IUsersServiceCheckEmail {
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

export interface IUsersServiceDeleteUser {
  id: User['id'];
}

export interface IUserServiceUnfollowing {
  id: User['id'];
  followingid: Following['id'];
}

export interface IUsersServiceFollowing {
  id: User['id'];
  following: Following;
}

export interface IUsersServiceFindByUsers {
  users: {
    id: string;
  }[];
}

export interface IUsersServiceFetchUser {
  fetchUserInput: FetchUserInput;
}
