import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolloweesService } from '../followees/followees.service';
import { UsersService } from '../users/users.service';
import { FetchFollowing } from './dto/followings-fetch.return-type';
import { Following } from './entities/followings.entity';
import {
  IFollowingsServiceFetchFollwings,
  IFollowingsServiceFindFollwing,
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

  findOneFollowing({
    followingid,
  }: IFollowingsServiceFindFollwing): Promise<Following> {
    return this.followingRepository.findOne({
      where: { followingid },
      relations: ['users'],
    });
  }

  async updateFollowing({
    id,
    followingid,
  }: IFollowingsServiceUpdate): Promise<boolean> {
    const user = await this.usersService.findOneUser({ id });

    const isFollowing = user.followings.filter(
      (el) => el.followingid === followingid,
    );

    if (!isFollowing.length) {
      const following = await this.findOneFollowing({ followingid });

      if (following) {
        const result = await Promise.all([
          this.usersService.following({
            id,
            following,
          }),
          this.followeesService.createFollowee({
            userid: id,
            user: await this.usersService.findOneUser({
              id: following.followingid,
            }),
            followeeid: followingid,
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
        }),
      ]);
      return result ? true : false;
    }
    await this.usersService.unfollowing({ id, followingid });
    return false;
  }

  async fetchFollowings({
    id,
    guestid,
  }: IFollowingsServiceFetchFollwings): Promise<FetchFollowing> {
    const result = await this.followingRepository.find({
      where: { users: [{ id }] },
      relations: ['users'],
    });

    let following,
      user = [];

    if (result) {
      const users = [];
      result.forEach((el) => {
        if (el.followingid) users.push(el.followingid);
      });

      following = result.filter((el) => el.followingid === guestid).length;
      user = await this.usersService.findByUsers({ users });
    }

    return {
      user: user,
      following: following ? true : false,
    };
  }
}
