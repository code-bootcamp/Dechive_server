import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly commentRepository: Repository<Reply>, //
  ) {}

  async createComment({ boardid, createCommentInput }): Promise<Reply> {
    return this.commentRepository.save({
      ...createCommentInput,
      boardid,
    });
  }
  async deleteComment({ commentid }) {
    return this.commentRepository.delete({ id: commentid });
  }
}
