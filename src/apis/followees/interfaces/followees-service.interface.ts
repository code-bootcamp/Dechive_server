import { User } from 'src/apis/users/entities/user.entity';
import { Followee } from '../entities/followees.entity';

export interface IFolloweesServiceCreateFollowee {
  userid: User['id'];
  followeeid: User['id'];
  user: User;
}

export interface IFolloweesServiceFindOne {
  followeeid: User['id'];
}
