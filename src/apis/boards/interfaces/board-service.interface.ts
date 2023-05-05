import { User } from 'src/apis/users/entities/user.entity';
import { Board } from '../entities/board.entity';
import { CreateBoardInput } from '../dto/board-create.input';
import { UpdateBoardInput } from '../dto/board-update.input';

export interface IBoardsServiceFetchsUserLiked {
  id: User['id'];
}

export interface IBoardsServiceFindBoard {
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

export interface IBoardsServiceUpdateBoard {
  userid: User['id'];
  boardid: Board['id'];
  updateBoardInput: UpdateBoardInput;
}

export interface IBoardsServiceFindUserBoards {
  id: User['id'];
  userid: User['id'];
}

export interface IBoardsServiceFindByTitle {
  title: IBoardsServiceSearchBoards['keyword'];
}

export interface IBoardsServiceFindUserBoards {
  id: User['id'];
  userid: User['id'];
}

export interface IBoardsServiceDeleteBoard {
  userid: User['id'];
  boardid: Board['id'];
}

export interface IBoardsServiceUpdateBoardLiker {
  userid: User['id'];
  boardid: Board['id'];
}
export interface IBoardsServiceGetLikeStatus {
  userid: User['id'];
  boards: Board[];
}
