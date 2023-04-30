import { User } from 'src/apis/users/entities/user.entity';
import { Comments } from '../entities/comment.entity';
import { CreateCommentInput } from '../dto/comments-create.input';

export interface ICommentsServiceFindOne {
  commentid: Comments['id'];
}

export interface ICommentsServiceCreate {
  userid: User['id'];
  createCommentInput: CreateCommentInput;
}

export interface ICommentsServiceDelete {
  userid: User['id'];
  commentid: Comments['id'];
}
