import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reply } from './entities/reply.entity';
import { CommentsService } from '../comments/comment.service';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly repliesRepository: Repository<Reply>, //

    private readonly commentsService: CommentsService,
  ) {}

  async findOneReply({ replyid }): Promise<Reply> {
    const reply = await this.repliesRepository.findOne({
      where: { id: replyid },
      relations: ['user'],
    });
    if (!reply) throw new ConflictException('존재 하지 않는 대댓글입니다');
    return reply;
  }

  async createReply({
    userid,
    createReplyInput, //
  }): Promise<Reply> {
    const { commentid, content } = createReplyInput;
    await this.commentsService.findOneComment({ commentid });
    return this.repliesRepository.save({
      content,
      comment: { id: commentid },
      user: { id: userid },
    });
  }

  async deleteReply({
    userid,
    replyid, //
  }): Promise<DeleteResult> {
    const reply = await this.findOneReply({ replyid });
    if (reply.user.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    return this.repliesRepository.delete({ id: replyid });
  }
}
