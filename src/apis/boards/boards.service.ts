import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { CommentsService } from '../comments/comment.service';
import { Comments } from '../comments/entities/comment.entity';
import { Reply } from '../Replies/entities/reply.entity';
import { RepliesService } from '../Replies/reply.service';
import { PicturesService } from '../pictures/pictures.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService,

    private readonly picturesService: PicturesService,

    private readonly usersService: UsersService,

    private readonly commentsService: CommentsService,

    private readonly repliesService: RepliesService,
  ) {}

  async findOneBoard({ boardid }): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id: boardid },
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        'pictures',
      ],
    });
    if (!board) throw new ConflictException('존재 하지 않는 게시물입니다');
    return board;
  }

  async fetchOneViewCount({ boardid }): Promise<Board> {
    const board = await this.findOneBoard({ boardid });
    return this.boardsRepository.save({
      ...board,
      views: (board.views += 1),
    });
  }

  async findAllBoards(): Promise<Board[]> {
    return await this.boardsRepository.find({
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        'pictures',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findBestBoards(): Promise<Board[]> {
    return this.boardsRepository.find({
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        'pictures',
      ],
      order: {
        likes: 'DESC',
        views: 'DESC',
      },
    });
  }

  async createBoard({
    createBoardInput,
    userid,
    // files
  }): Promise<Board> {
    // image 업로드 후 링크 받아오기

    // bulk insert 활용한 최적화 필요
    let hashtags: Hashtag[];
    if (createBoardInput?.hashtags) {
      hashtags = await this.hashtagsService.createHashtags({
        ...createBoardInput,
      });
    }
    const products = await this.productsService.createProducts({
      ...createBoardInput,
    });
    const pictures = await this.picturesService.createPictures({
      ...createBoardInput,
    });
    return this.boardsRepository.save({
      ...createBoardInput,
      writer: { id: userid },
      hashtags: hashtags ? hashtags : null,
      products,
      pictures,
    });
  }

  async test({ storageDelet }) {
    return this.picturesService.storageDelete({ storageDelet });
  }

  async updateBoard({
    updateBoardInput, //
    boardid,
    userid,
  }): Promise<Board> {
    const prevBoard = await this.findOneBoard({ boardid });
    if (prevBoard.writer.id !== userid)
      throw new UnauthorizedException('수정 권한이 없습니다.');
    const prevProducts = prevBoard.products;
    const { updateProductInputs } = updateBoardInput;
    const products = await this.productsService.updateProducts({
      updateProductInputs: updateProductInputs.map((e) => {
        const found = prevProducts.find((el) => el.url === e.url);
        if (found) {
          e.picture = found.picture;
        } // In(Array) 사용해보기
        return e;
      }),
    });
    const toDelete = prevBoard.pictures.filter(
      (e) => !updateBoardInput.uploadFile.includes(e.url),
    );
    Promise.all(
      toDelete.map((e) => {
        console.log(e);
        return this.picturesService.storageDelete({
          storageDelet: e.url.split('origin/').at(-1),
        });
      }),
    );
    const pictures = await this.picturesService.createPictures({
      ...updateBoardInput,
    });
    const hashtags = await this.hashtagsService.createHashtags({
      ...updateBoardInput,
    });
    await this.productsService.delete({ boardid });
    await this.picturesService.deleteByboardid({ boardid });

    return this.boardsRepository.save({
      id: boardid,
      ...updateBoardInput,
      products,
      hashtags,
      pictures,
    });
  }

  async deleteBoard({ userid, boardid }): Promise<DeleteResult> {
    const prevBoard = await this.findOneBoard({ boardid });
    if (prevBoard.writer.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');

    return this.boardsRepository.delete({ id: boardid });
  }

  async updateBoardLiker({ userid, boardid }) {
    const prevBoard = await this.findOneBoard({ boardid });
    const index = prevBoard.likers.findIndex((el) => el.id === userid);
    const Added = index === -1;
    let likes = prevBoard.likers.length;
    if (Added) {
      prevBoard.likers.push(
        await this.usersService.findOneUser({ id: userid }),
      );
      likes += 1;
    } else {
      prevBoard.likers[index] = null;
      likes -= 1;
    }
    await this.boardsRepository.save({
      ...prevBoard,
      likes,
    });
    return Added;
  }

  async createComment({
    userid,
    createCommentInput, //
  }): Promise<Comments> {
    const { boardid } = createCommentInput;
    // 게시물이 존재하는지 확인
    await this.findOneBoard({ boardid });
    return await this.commentsService.createComment({
      userid,
      createCommentInput,
    });
  }

  async deleteComment({
    userid,
    commentid, //
  }): Promise<DeleteResult> {
    const comment = await this.commentsService.findOneComment({ commentid });
    if (comment.user.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    return this.commentsService.deleteComment({ commentid });
  }

  async createReply({
    userid,
    createReplyInput, //
  }): Promise<Reply> {
    const { commentid } = createReplyInput;
    // 대댓글을 달 댓글이 존재하는지 확인
    await this.commentsService.findOneComment({ commentid });
    return this.repliesService.createReply({
      userid,
      createReplyInput,
    });
  }

  async deleteReply({
    userid,
    replyid, //
  }): Promise<DeleteResult> {
    const reply = await this.repliesService.findOneReply({ replyid });
    if (reply.user.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    return this.repliesService.deleteReply({ replyid });
  }
}
