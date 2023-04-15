import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersMoulde } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}), //
    UsersMoulde,
  ],
  providers: [
    AuthResolver, //
    AuthService,
  ],
})
export class AuthModule {}
