import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  IAuthServiceGetAccseToken,
  IAuthServiceLogin,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //

    private readonly usersService: UsersService,
  ) {}

  async login({ loginInput, res }: IAuthServiceLogin): Promise<string> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneEamil({ email });

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    this.setRefreshToken({ user, res });

    return this.getAccseToken({ user });
  }

  getAccseToken({ user }: IAuthServiceGetAccseToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.ACCESS_TOKEN, expiresIn: '2h' },
    );
  }

  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' },
    );

    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken};path=/; domain=.mobomobo.shop; SameSite=None; Secure; httpOnly`,
    );
  }
}
