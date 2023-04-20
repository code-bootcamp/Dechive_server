import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolloweesService } from '../followees/followees.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Following } from './entities/followings.entity';
import {
  IFollowingsServiceFetchFollwings,
  IFollowingsServiceUpdate,
} from './interfaces/followings-service.interface';

@Injectable()
export class FollowingsService {
  constructor(
    @InjectRepository(Following)
    private readonly followingRepository: Repository<Following>, //

    private readonly usersService: UsersService, //

    private readonly followeesService: FolloweesService, //
  ) {}

  async updateFollowing({
    id,
    followingid,
  }: IFollowingsServiceUpdate): Promise<boolean> {
    const user = await this.usersService.findeOneUser({ id });

    const isFollowing = user.followings.filter(
      (el) => el.followingid === followingid,
    );

    if (!isFollowing.length) {
      const following = await this.followingRepository.findOne({
        where: { followingid },
        relations: ['users'],
      });
      if (following) {
        const result = await Promise.all([
          this.usersService.following({
            id,
            following,
          }),
          this.followeesService.createFollowee({
            userid: user.id,
            user: await this.usersService.findeOneUser({
              id: following.followingid,
            }),
          }),
        ]);

        return result.length ? true : false;
      }

      const result = await Promise.all([
        this.followingRepository.save({
          followingid,
          users: [{ id }],
        }),
        this.followeesService.createFollowee({
          userid: followingid,
          followeeid: id,
          user,
        }),
      ]);
      return result ? true : false;
    }
    await this.usersService.unfollowing({ id, followingid });
    await this.followeesService.unFollowee({ id: user.id, followeeid: id });
    return false;
  }

  async fetchFollowings({
    id,
  }: IFollowingsServiceFetchFollwings): Promise<User[]> {
    const result = await this.followingRepository.find({
      where: { users: { id } },
      relations: ['users'],
    });

    const users = [];
    result.forEach((el) => {
      if (el.followingid) users.push(el.followingid);
    });

    return this.usersService.findByUsers({ users });
  }
}
