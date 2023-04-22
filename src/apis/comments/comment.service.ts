import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Comments } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>, //
  ) {}

  findOneComment({ commentid }): Promise<Comments> {
    return this.commentsRepository.findOne({
      where: { id: commentid },
      relations: ['user'],
    });
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
