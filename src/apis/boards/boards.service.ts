import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PicturesService } from '../pictures/pictures.service';
import { Product } from '../products/entities/product.entity';
import {
  IBoardsServiceCreateBoard,
  IBoardsServiceFetchBoard,
  IBoardsServiceFetchProductsByUserid,
  IBoardsServiceFetchsUserLiked,
  IBoardsServiceSearchBoards,
  IBoardsServiceUpdateBoard,
  IBoardsServiceFindByTitle,
  IBoardsServiceFindUserBoards,
  IBoardsServiceDeleteBoard,
  IBoardsServiceUpdateBoardLiker,
  IBoardsServiceFindBoard,
} from './interfaces/board-service.interface';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService,

    private readonly picturesService: PicturesService,

    private readonly usersService: UsersService,
  ) {}

  async findOneBoard({
    isView,
    boardid, //
  }: IBoardsServiceFindBoard): Promise<Board> {
    const board = await this.boardsRepository.findOne({
      where: { id: boardid },
      relations: [
        'writer',
        'products',
        'comments',
        'hashtags',
        'likers',
        'pictures',
        'comments.replies',
        'comments.replies.user',
        'comments.user',
      ],
      order: {
        comments: {
          createdAt: 'DESC',
          replies: {
            createdAt: 'DESC',
          },
        },
      },
    });
    if (!board) throw new ConflictException('존재 하지 않는 게시물입니다');
    if (isView) {
      return this.boardsRepository.save({
        ...board,
        views: board.views + 1,
      });
    }
    return board;
  }
  // findOneWithLike({
  //   isView,
  //   boardid,
  //   userid, //
  // }: IBoardsServiceFetchBoard) {
  //   // const board = await this.findOneBoard({
  //   //   isView,
  //   //   boardid,
  //   // });
  //   // this.getLikeStatus({ boards: [board], userid })[0];
  //   // 프론트에서 서버사이드 렌더링 관련 이슈로 userid값을 넘겨주기 어려워 userid를 사용하지 않음
  //   return this.findOneBoard({
  //     isView,
  //     boardid,
  //   });
  // }

  async findAllBoards({ userid }): Promise<Board[]> {
    const boards = await this.boardsRepository.find({
      relations: ['writer', 'products', 'hashtags', 'likers', 'pictures'],
      order: {
        createdAt: 'DESC',
      },
    });
    if (userid) return this.getLikeStatus({ boards, userid });
    return boards;
  }

  async findTop10({ userid }): Promise<Board[]> {
    const boards = await this.boardsRepository.find({
      relations: ['writer', 'products', 'hashtags', 'likers', 'pictures'],
      order: {
        likes: 'DESC',
        views: 'DESC',
        createdAt: 'DESC',
      },
      take: 10,
    });
    if (userid) return this.getLikeStatus({ boards, userid });
    return boards;
  }

  async findUserBoards({
    id,
    userid,
  }: IBoardsServiceFindUserBoards): Promise<Board[]> {
    const boards = await this.boardsRepository.find({
      where: {
        writer: { id: userid ?? id },
      },
      relations: ['writer', 'products', 'hashtags', 'likers', 'pictures'],
      order: {
        createdAt: 'DESC',
      },
    });
    if (userid) return this.getLikeStatus({ boards, userid });
    return boards;
  }

  findByTitle({
    title, //
  }: IBoardsServiceFindByTitle): Promise<string[]> {
    return this.boardsRepository
      .find({
        where: { title },
        select: { id: true },
      })
      .then((e) => (e ? e.map((el) => el.id) : []));
  }

  async searchBoards({
    keyword, //
  }: IBoardsServiceSearchBoards): Promise<Board[]> {
    let result = [];
    await Promise.all([
      this.findByTitle({ title: keyword }),
      this.usersService.findByNick({ nickName: keyword }),
      this.usersService.findByJob({ jobGroup: keyword }),
      this.hashtagsService.findByHash({ hashtag: `#${keyword}` }),
    ]).then((e) => {
      result = [].concat(...e);
    });
    const set = new Set(result);
    return this.boardsRepository.find({
      where: [{ id: In([...set]) }],
      relations: ['writer', 'products', 'hashtags', 'likers', 'pictures'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findProductsFromOneUser({
    userid, //
  }: IBoardsServiceFetchProductsByUserid): Promise<Product[]> {
    return [].concat(
      ...(await this.usersService.findOneUser({ id: userid })).boards.map(
        (board) => board.products,
      ),
    );
  }

  async findBoardUserLiked({
    id,
  }: IBoardsServiceFetchsUserLiked): Promise<Board[]> {
    const result = (await this.usersService.findOneUser({ id })).like.map(
      (e) => e.id,
    );
    //유저 relations를 like의 세부항목까지 거는 것 보다 쿼리속도가 빨라서 아래방법 사용
    const boards = await this.boardsRepository.find({
      where: {
        id: In(result),
      },
      relations: ['writer', 'products', 'hashtags', 'likers', 'pictures'],
      order: {
        createdAt: 'DESC',
      },
    });
    return boards.map((e) => {
      return {
        ...e,
        like: true,
      };
    });
  }

  getLikeStatus = ({ boards, userid }) => {
    boards.forEach((el) => {
      if (el.likers.length) {
        el.likers.forEach((e) => {
          if (userid === e.id) {
            el['like'] = true;
          }
        });
      }
    });
    return boards;
  };

  async createBoard({
    userid,
    createBoardInput,
  }: IBoardsServiceCreateBoard): Promise<Board> {
    // bulk insert 활용한 최적화 필요
    let hashtags: Hashtag[];
    // Promise.all
    if (createBoardInput.hashtags) {
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
    const writer = await this.usersService.findOneUser({ id: userid });
    return this.boardsRepository.save({
      ...createBoardInput,
      hashtags: hashtags ?? null,
      products,
      pictures,
      writer,
    });
  }

  async updateBoard({
    userid,
    boardid,
    updateBoardInput, //
  }: IBoardsServiceUpdateBoard): Promise<Board> {
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

    toDelete.forEach((e) => {
      this.picturesService.storageDelete({
        storageDelet: e.url.split('origin/').at(-1),
      });
    });

    const pictures = await this.picturesService.createPictures({
      ...updateBoardInput,
    });
    let hashtags: Hashtag[];
    if (updateBoardInput.hashtags) {
      hashtags = await this.hashtagsService.createHashtags({
        ...updateBoardInput,
      });
    }
    await this.productsService.delete({ boardid });
    await this.picturesService.delete({ boardid });

    return this.boardsRepository.save({
      id: boardid,
      ...updateBoardInput,
      products,
      hashtags,
      pictures,
    });
  }

  async deleteBoard({
    userid, //
    boardid,
  }: IBoardsServiceDeleteBoard): Promise<DeleteResult> {
    const prevBoard = await this.findOneBoard({ boardid });
    if (prevBoard.writer.id !== userid)
      throw new UnauthorizedException('삭제 권한이 없습니다.');

    return this.boardsRepository.delete({ id: boardid });
  }

  async updateBoardLiker({
    userid, //
    boardid,
  }: IBoardsServiceUpdateBoardLiker): Promise<boolean> {
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
}
