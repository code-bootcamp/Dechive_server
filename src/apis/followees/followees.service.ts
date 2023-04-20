import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Followee } from './entities/followees.entity';
import {
  IFolloweesServiceCreateFollowee,
  IFolloweesServiceFindOne,
  IFolloweesServiceUnFollowee,
} from './interfaces/followees-service.interface';

@Injectable()
export class FolloweesService {
  constructor(
    @InjectRepository(Followee)
    private readonly followeeRepository: Repository<Followee>, //
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
    if (followeeid) {
      const followee = await this.findOneFollowee({ followeeid });

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

  async unFollowee({
    followeeid,
    id,
  }: IFolloweesServiceUnFollowee): Promise<Followee> {
    const followee = await this.findOneFollowee({ followeeid });

    followee.users = followee.users.filter((el) => el.id !== id);

    return this.followeeRepository.save(followee);
  }
}
