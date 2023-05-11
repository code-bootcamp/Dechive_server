import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reply } from './entities/reply.entity';
import { CommentsService } from '../comments/comment.service';
import {
  IRepliesServiceCreate,
  IRepliesServiceDelete,
  IRepliesServiceFindOne,
} from './interfaces/replies-service.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly repliesRepository: Repository<Reply>,

    private readonly commentsService: CommentsService,

    private readonly usersService: UsersService,
  ) {}

  async findOneReply({
    replyid, //
  }: IRepliesServiceFindOne): Promise<Reply> {
    const reply = await this.repliesRepository.findOne({
      where: { id: replyid },
      relations: ['user'],
    });
    if (!reply) throw new ConflictException('존재 하지 않는 대댓글입니다');
    return reply;
  }

  async createReply({
    userid,
    createReplyInput,
  }: IRepliesServiceCreate): Promise<Reply> {
    const { commentid, content } = createReplyInput;
    await this.commentsService.findOneComment({ commentid });
    return this.repliesRepository.save({
      content,
      comment: { id: commentid },
      user: await this.usersService.findOneUser({ id: userid }),
    });
  }

  async deleteReply({
    userid,
    replyid,
  }: IRepliesServiceDelete): Promise<DeleteResult> {
    const reply = await this.findOneReply({ replyid });
    if (reply.user.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    return this.repliesRepository.delete({ id: replyid });
  }
}
