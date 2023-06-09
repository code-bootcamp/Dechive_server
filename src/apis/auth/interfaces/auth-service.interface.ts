import { Request, Response } from 'express';
import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interfaces/context';
import { IProvider, PROVIDER_ENUM } from 'src/commons/interfaces/provider';
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

export interface IAuthServiceGetRefreshToken {
  user: IAuthUser['user'];
}

export interface IAuthServiceLogout {
  req: IContext['req'];
}

export interface IAuthServcieIsToken {
  token: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface IAuthServiceSocialLogin {
  req: Request & IAuthUser;
  res: Response;
  provider: PROVIDER_ENUM;
}
