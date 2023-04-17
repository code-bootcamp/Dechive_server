import { User } from 'src/apis/users/entities/user.entity';
import { Following } from '../entities/followings.entity';

export interface IFollowingsServiceUpdate {
  id: User['id'];
  followingid: User['id'];
}
