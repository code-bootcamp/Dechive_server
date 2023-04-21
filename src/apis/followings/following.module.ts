import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followee } from '../followees/entities/followees.entity';
import { FolloweesService } from '../followees/followees.service';
import { UsersMoulde } from '../users/users.module';
import { Following } from './entities/followings.entity';
import { FollowingsResolver } from './following.resolver';
import { FollowingsService } from './following.service';

@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Following, //
      Followee,
    ]),
  ],
  providers: [
    FollowingsResolver, //
    FollowingsService,
    FolloweesService, //
  ],
  exports: [
    FollowingsService, //
  ],
})
export class FollowingsModule {}
