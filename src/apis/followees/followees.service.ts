import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowingsService } from '../followings/following.service';
import { UsersService } from '../users/users.service';
import { FetchFollowee } from './dto/followees-fetch.return-type';
import { Followee } from './entities/followees.entity';
import {
  IFolloweesServiceCreateFollowee,
  IFolloweesServiceFindOne,
  IFollowingsServiceFetchFollowees,
} from './interfaces/followees-service.interface';

@Injectable()
export class FolloweesService {
  constructor(
    @InjectRepository(Followee)
    private readonly followeeRepository: Repository<Followee>, //

    private readonly usersService: UsersService,
  ) {}

  findOneFollowee({ followeeid }: IFolloweesServiceFindOne): Promise<Followee> {
    return this.followeeRepository.findOne({
      where: { followeeid },
      relations: ['users'],
    });
  }

  async createFollowee({
    userid: id,
    user,
    followeeid,
  }: IFolloweesServiceCreateFollowee): Promise<Followee> {
    if (user) {
      const followee = await this.findOneFollowee({ followeeid: id });

      if (followee) {
        const users = [...followee.users, user];

        return this.followeeRepository.save({
          ...followee,
          users,
        });
      }
    }

    return this.followeeRepository.save({
      followeeid,
      users: [{ id }],
    });
  }

  async fetchFollowees({
    id,
    guestid,
  }: IFollowingsServiceFetchFollowees): Promise<FetchFollowee> {
    const result = await this.findOneFollowee({ followeeid: id });

    let followee,
      user = [];

    if (result) {
      const users = [];
      result?.users.forEach((el) => {
        if (el.id) users.push(el.id);
      });

      followee = result?.users.filter((el) => el.id === guestid).length;
      user = await this.usersService.findByUsers({ users });
    }

    return {
      user,
      followee: followee ? true : false,
    };
  }
}
