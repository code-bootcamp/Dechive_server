import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
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
    return {
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
