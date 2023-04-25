import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/login/naver',
      scope: ['email'],
    });
  }

  validate(_: string, __: string, profile: Profile) {
    console.log(profile);
    return {
      email: profile.email,
    };
  }
}
