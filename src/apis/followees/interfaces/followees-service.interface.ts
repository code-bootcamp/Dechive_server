import { User } from 'src/apis/users/entities/user.entity';
import { Followee } from '../entities/followees.entity';

export interface IFolloweesServiceCreateFollowee {
  userid: User['id'];
  followeeid?: User['id'];
  user: User;
}

export interface IFolloweesServiceFindOne {
  followeeid: Followee['followeeid'];
}

export interface IFolloweesServiceUnFollowee {
  followeeid: Followee['followeeid'];
  id: User['id'];
}
