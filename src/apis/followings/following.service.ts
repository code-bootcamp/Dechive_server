import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getFollowingByFollowees } from 'src/commons/util/getFollowing-Followee';
import { Repository } from 'typeorm';
import { FolloweesService } from '../followees/followees.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Following } from './entities/followings.entity';
import {
  IFollowingsServiceFetchFollwings,
  IFollowingsServiceFindFollwing,
  IFollowingsServiceFindFollwingBoards,
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
  }: IFollowingsServiceFetchFollwings): Promise<User[]> {
    const result = await this.followingRepository.find({
      where: { users: [{ id }] },
      relations: ['users'],
    });

    let user = [];

    if (result) {
      const users = [];
      result.forEach((el) => {
        if (el.followingid) users.push(el.followingid);
      });

      const guest = await this.usersService.findOneUser({ id: guestid });

      user = getFollowingByFollowees({
        guest,
        user: await this.usersService.findByUsers({ users }),
      });
    }
    return user;
  }

  async fetchFollowingBoards({
    id,
  }: IFollowingsServiceFindFollwingBoards): Promise<User[]> {
    const users = await this.followingRepository
      .find({
        where: { users: { id } },
      })
      .then((e) => (e ? e.map((el) => el.followingid) : []));

    return this.usersService.followingBoards({ users });
  }
}
