import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMoulde } from '../users/users.module';
import { Following } from './entities/followings.entity';
import { FollowingsResolver } from './following.resolver';
import { FollowingsService } from './following.service';

@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Following, //
    ]),
  ],
  providers: [
    FollowingsResolver, //
    FollowingsService,
  ],
  exports: [
    FollowingsService, //
  ],
})
export class FollowingsModule {}
