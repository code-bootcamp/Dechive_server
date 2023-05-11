import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from '../auth/strategies/jwt-access.strategy';
import { SnsAccount } from '../snsAccount/entities/snsAccount.entity';
import { SnsAccountService } from '../snsAccount/snsAccount.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PicturesService } from '../pictures/pictures.service';
import { Picture } from '../pictures/entities/picture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      SnsAccount,
      Picture,
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    UsersResolver, //
    UsersService,
    SnsAccountService,
    PicturesService,
  ],
  exports: [
    UsersService, //
  ],
})
export class UsersMoulde {}
