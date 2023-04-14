import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnsAccount } from '../snsAccount/entities/snsAccount.entity';
import { SnsAccountService } from '../snsAccount/snsAccount.service';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      SnsAccount,
    ]),
  ],
  providers: [
    UsersResolver, //
    UsersService,
    SnsAccountService,
  ],
  exports: [
    UsersService, //
  ],
})
export class UsersMoulde {}
