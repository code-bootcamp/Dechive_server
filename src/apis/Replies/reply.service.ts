import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly repliesRepository: Repository<Reply>, //
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
    return this.repliesRepository.save({
      content,
      comment: { id: commentid },
      user: { id: userid },
    });
  }

  async deleteReply({ replyid }): Promise<DeleteResult> {
    return this.repliesRepository.delete({ id: replyid });
  }
}
