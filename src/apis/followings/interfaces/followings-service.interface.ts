import { User } from 'src/apis/users/entities/user.entity';
import { Following } from '../entities/followings.entity';

export interface IFollowingsServiceUpdate {
  id: User['id'];
  followingid: Following['followingid'];
}

export interface IFollowingsServiceFetchFollwings {
  id: User['id'];
  guestid: User['id'];
}

export interface IFollowingsServiceFindFollwing {
  followingid: User['id'];
}

export interface IFollowingsServiceFindFollwingBoards {
  id: User['id'];
}
