import { User } from 'src/apis/users/entities/user.entity';
import { Reply } from '../entities/reply.entity';
import { CreateReplyInput } from '../dto/reply-create.input';

export interface IRepliesServiceFindOne {
  replyid: Reply['id'];
}

export interface IRepliesServiceCreate {
  userid: User['id'];
  createReplyInput: CreateReplyInput;
}

export interface IRepliesServiceDelete {
  userid: User['id'];
  replyid: Reply['id'];
}
