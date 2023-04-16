import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  IAuthServcieIsToken,
  IAuthServiceGetAccseToken,
  IAuthServiceGetRefreshToken,
  IAuthServiceLogin,
  IAuthServiceLogout,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //

    private readonly usersService: UsersService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken};path=/; httpOnly`,
    );
    // res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken};path=/; domain=.mobomobo.shop; SameSite=None; Secure; httpOnly`,
    // );
  }

  restoreAccessToken({ user }: IAuthServiceGetRefreshToken): string {
    return this.getAccseToken({ user });
  }

  isToken({ token }: IAuthServcieIsToken): Record<string, object> {
    try {
      return {
        access: this.jwtService.verify(token.accessToken, {
          secret: process.env.ACCESS_TOKEN,
        }),
        refresh: this.jwtService.verify(token.refreshToken, {
          secret: process.env.REFRESH_TOKEN,
        }),
      };
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async logOut({ req }: IAuthServiceLogout): Promise<string> {
    const token = {
      accessToken: req.headers.authorization.split(' ')[1],
      refreshToken: req.headers.cookie.replace('refreshToken=', ''),
    };
    const tokens = this.isToken({ token });

    await Promise.all([
      this.cacheManager.set(`accessToken:${token.accessToken}`, 'accessToken', {
        ttl: tokens.access['exp'] - Math.trunc(Date.now() / 1000),
      }),
      this.cacheManager.set(
        `refreshToken:${token.refreshToken}`,
        'refreshToken',
        {
          ttl: tokens.refresh['exp'] - Math.trunc(Date.now() / 1000),
        },
      ),
    ]);

    return '로그아웃 완료';
  }
}
