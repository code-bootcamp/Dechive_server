import { User } from 'src/apis/users/entities/user.entity';
import { Board } from '../entities/board.entity';

export interface IBoardsServiceFetchsUserLiked {
  id: User['id'];
  userid: User['id'];
}

export interface IBoardsServiceFetchBoard {
  boardid: Board['id'];
  isView?: boolean;
}
