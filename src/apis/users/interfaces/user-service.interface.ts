import { CreateUserInput } from '../dto/user-create.input';
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
