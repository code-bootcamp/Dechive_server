import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>, //
  ) {}

  async findOneComment({ commentid }): Promise<Comments> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentid },
      relations: ['user'],
    });
    if (!comment) throw new ConflictException('존재 하지 않는 댓글입니다');
    return comment;
  }

  async createComment({
    userid,
    createCommentInput, //
  }): Promise<Comments> {
    const { boardid, content } = createCommentInput;
    return this.commentsRepository.save({
      content,
      board: { id: boardid },
      user: { id: userid },
    });
  }

  async deleteComment({ commentid }): Promise<DeleteResult> {
    return this.commentsRepository.delete({ id: commentid });
  }
}
