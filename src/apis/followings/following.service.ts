import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly usersService: UsersService, //

    @InjectRepository(Following)
    private readonly followingRepository: Repository<Following>,
  ) {}

  async updateFollowing({
    id,
    followingid,
  }: IFollowingsServiceUpdate): Promise<boolean> {
    console.log(id);
    const users = await this.usersService.findeOneUser({ id });

    const isFollowing = users.followings.filter(
      (el) => el.followingid === followingid,
    );

    if (!isFollowing.length) {
      const result = await this.followingRepository.findOne({
        where: { followingid },
      });

      if (result) {
        await this.followingRepository.save({
          ...users,
          ...result,
          users: [{ id }],
        });
        return true;
      }
      await this.followingRepository.save({
        followingid,
        users: [{ id }],
      });
      return true;
    }
    await this.usersService.unfollowing({ id, followingid });
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
