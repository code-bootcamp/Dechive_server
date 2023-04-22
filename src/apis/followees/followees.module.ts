import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followee } from '../followees/entities/followees.entity';
import { FolloweesService } from '../followees/followees.service';
import { UsersMoulde } from '../users/users.module';
import { FolloweesResolver } from './followees.resolver';

@Module({
  imports: [
    UsersMoulde,
    TypeOrmModule.forFeature([
      Followee, //
    ]),
  ],
  providers: [
    FolloweesResolver, //
    FolloweesService,
  ],
  exports: [
    FolloweesService, //
  ],
})
export class FolloweesModule {}
