import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/login/kakao',
      scope: ['account_email'],
    });
  }

  validate(_: string, __: string, profile: Profile) {
    console.log(profile);
    return {
      email: profile._json.kakao_account.email,
    };
  }
}
