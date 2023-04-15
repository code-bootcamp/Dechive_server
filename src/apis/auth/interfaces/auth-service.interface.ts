import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interfaces/context';
import { LoginInput } from '../dto/auth-login.input';

export interface IAuthServiceGetAccseToken {
  user: IAuthUser['user'];
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: IContext['res'];
}

export interface IAuthServiceLogin {
  loginInput: LoginInput;
  res: IContext['res'];
}
