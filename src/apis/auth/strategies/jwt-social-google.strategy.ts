import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://mobomobo.shop/login/google',
      scope: ['email', 'profile'],
    });
  }

  validate(_: string, __: string, profile: Profile) {
    return {
      email: profile.emails[0].value,
    };
  }
}
