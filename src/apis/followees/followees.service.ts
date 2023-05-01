import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
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
      return this.followeeRepository.save({
        followeeid: id,
        users: [{ id: followeeid }],
      });
    }

    return this.followeeRepository.save({
      followeeid,
      users: [{ id }],
    });
  }

  async fetchFollowees({
    id,
    guestid,
  }: IFollowingsServiceFetchFollowees): Promise<User[]> {
    const result = await this.followeeRepository.find({
      where: { users: [{ id }] },
      relations: ['users'],
    });
    let user = [];

    if (result) {
      const users = [];
      result.forEach((el) => {
        if (el.followeeid) users.push(el.followeeid);
      });
      const guest = await this.usersService.findOneUser({ id: guestid });
      user = await this.usersService.findByUsers({ users });

      const followeeid = guest.followees.map((el) => el.followeeid);
      const followingid = guest.followings.map((el) => el.followingid);

      user.forEach((el) => {
        el['followeesCount'] = el.followees.length;
        el['followingsCount'] = el.followings.length;

        el['followeeStatus'] = followeeid.includes(el.id) ?? false;
        el['followingStatus'] = followingid.includes(el.id) ?? false;
      });
    }
    console.log(user);
    return user;
  }
}
