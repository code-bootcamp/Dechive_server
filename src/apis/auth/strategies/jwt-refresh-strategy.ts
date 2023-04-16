import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const refreshToken = req.headers.cookie.split('=')[1];
        return refreshToken;
      },
      secretOrKey: process.env.REFRESH_TOKEN,
      passReqToCallback: true,
    });
  }
  async validate(req, payload) {
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const redisRefreshToken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    if (redisRefreshToken) throw new UnauthorizedException('로그인 해주세요');

    return {
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
