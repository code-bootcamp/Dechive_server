import {
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  HttpStatus,
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
  IAuthServiceSocialLogin,
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
    const user = await this.usersService.checkEmail({ email });

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    this.setRefreshToken({ user, res });

    return this.getAccseToken({ user });
  }

  getAccseToken({ user }: IAuthServiceGetAccseToken): string {
    return this.jwtService.sign(
      { sub: { email: user.email, id: user.id } },
      { secret: process.env.ACCESS_TOKEN, expiresIn: '2h' },
    );
  }

  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: { email: user.email, id: user.id } },
      { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' },
    );
    const header = res.req?.rawHeaders;
    const origin = header ? header[header.indexOf('Origin') + 1] : 'Error';
    console.log(origin);
    if (process.env.WHITELIST.split(' ').includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain=.mobomobo.shop; Secure; SameSite=None; httpOnly`,
      );
    } else {
      throw new HttpException('refresh CORS 오류', HttpStatus.BAD_REQUEST);
    }
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

  async socialLogin({
    req,
    res,
    provider,
  }: IAuthServiceSocialLogin): Promise<void> {
    let user = await this.usersService.findOneEmail({
      email: req.user.email,
    });

    if (!user)
      user = await this.usersService.createUser({
        createUserInput: { ...req.user, provider, jobGroup: '미선택' },
      });

    if (user.provider !== provider)
      user = await this.usersService.socialLoginProviderUpdate({
        id: user.id,
        provider,
      });

    this.setRefreshToken({ user, res });
    res.redirect(process.env.ORIGIN);
  }
}
