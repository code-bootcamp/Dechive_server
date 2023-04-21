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
// import { PicturesService } from '../pictures/pictures.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService, // private readonly picturesService: PicturesService,

    private readonly usersService: UsersService, // private readonly picturesService: PicturesService,
  ) {}

  async findOneBoard({ boardId }): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        // 'picture',
      ],
    });
    if (!board) throw new ConflictException('존재 하지 않는 게시물 입니다');
    return board;
  }

  async fetchOneViewCount({ boardId }): Promise<Board> {
    const board = await this.findOneBoard({ boardId });
    board.views += 1;
    return this.boardsRepository.save({ ...board });
  }

  async findAllBoards(): Promise<Board[]> {
    const boards = await this.boardsRepository.find({
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        // 'picture',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
    return boards;
  }

  async findBestBoards(): Promise<Board[]> {
    const boards = await this.boardsRepository.find({
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        // 'picture',
      ],
      order: {
        likes: 'DESC',
        views: 'DESC',
      },
    });
    return boards;
  }

  async createBoard({
    createBoardInput,
    userId,
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
    // const pictures = await this.picturesService.createPictures({ files });
    return this.boardsRepository.save({
      ...createBoardInput,
      writer: { id: userId },
      hashtags: hashtags ? hashtags : null,
      products,
    });
  }

  async updateBoard({
    updateBoardInput, //
    boardId,
    userId,
  }): Promise<Board> {
    const prevBoard = await this.findOneBoard({ boardId });
    if (prevBoard.writer.id !== userId)
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
    const hashtags = await this.hashtagsService.createHashtags({
      ...updateBoardInput,
    });
    await this.productsService.deleteProducts({ boardId });
    // await this.boardsRepository.delete({ id: boardId });

    return this.boardsRepository.save({
      id: boardId,
      ...updateBoardInput,
      products,
      hashtags,
    });
  }

  async deleteBoard({ userId, boardId }): Promise<DeleteResult> {
    const prevBoard = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: ['writer'],
    });
    if (prevBoard.writer.id !== userId)
      throw new UnauthorizedException('삭제 권한이 없습니다.');

    return this.boardsRepository.delete({ id: boardId });
  }

  async updateBoardLiker({ userId, boardId }) {
    const prevBoard = await this.findOneBoard({ boardId });
    const index = prevBoard.likers.findIndex((el) => el.id === userId);
    const Added = index === -1;
    let likes = prevBoard.likers.length;
    if (Added) {
      prevBoard.likers.push(
        await this.usersService.findeOneUser({ id: userId }),
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
}
