import { User } from 'src/apis/users/entities/user.entity';
import { Board } from '../entities/board.entity';
import { CreateBoardInput } from '../dto/board-create.input';

export interface IBoardsServiceFetchsUserLiked {
  id: User['id'];
  userid: User['id'];
}

export interface IBoardsServiceFetchBoard {
  boardid: Board['id'];
  isView?: boolean;
}

export interface IBoardsServiceFetchProductsByUserid {
  userid: User['id'];
}

export interface IBoardsServiceSearchBoards {
  keyword: string;
}

export interface IBoardsServiceCreateBoard {
  userid: User['id'];
  createBoardInput: CreateBoardInput;
}
