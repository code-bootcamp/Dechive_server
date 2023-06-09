import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Comments } from './entities/comment.entity';
import { BoardsService } from '../boards/boards.service';
import {
  ICommentsServiceCreate,
  ICommentsServiceDelete,
  ICommentsServiceFindOne,
} from './interfaces/comment-service.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,

    private readonly boardsService: BoardsService,

    private readonly usersService: UsersService,
  ) {}

  async findOneComment({
    commentid, //
  }: ICommentsServiceFindOne): Promise<Comments> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentid },
      relations: ['user'],
    });
    if (!comment) throw new ConflictException('존재 하지 않는 댓글입니다');
    return comment;
  }

  async createComment({
    userid,
    createCommentInput,
  }: ICommentsServiceCreate): Promise<Comments> {
    // 게시물이 존재하는지 확인
    const { boardid, content } = createCommentInput;
    await this.boardsService.findOneBoard({ boardid });

    return this.commentsRepository.save({
      content,
      board: { id: boardid },
      user: await this.usersService.findOneUser({ id: userid }),
    });
  }

  async deleteComment({
    userid,
    commentid,
  }: ICommentsServiceDelete): Promise<DeleteResult> {
    const comment = await this.findOneComment({ commentid });
    if (comment.user.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    return this.commentsRepository.delete({ id: commentid });
  }
}
