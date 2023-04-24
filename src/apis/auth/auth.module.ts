import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersMoulde } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { JwtKakaoStrategy } from './strategies/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from './strategies/jwt-social-naver.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    UsersMoulde,
  ],
  providers: [
    AuthResolver, //
    AuthService,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
