
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
// import { PicturesService } from '../pictures/pictures.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService, // private readonly picturesService: PicturesService,
  ) {}

  async createBoard({
    createBoardInput,
    // files
    id,
  }): Promise<Board> {
    // image 업로드 후 링크 받아오기

    // bulk insert 활용한 최적화 필요
    const hashtags = await this.hashtagsService.createHashtags({
      ...createBoardInput,
    });
    const products = await this.productsService.createProducts({
      ...createBoardInput,
    });
    // const pictures = await this.picturesService.createPictures({ files });
    return this.boardsRepository.save({
      ...createBoardInput,
      writer: { id },
      hashtags,
      products,
    });
  }

  async deleteBoard({ id, boardId }): Promise<DeleteResult> {
    const prevBoard = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: ['writer'],
    });
    if (prevBoard.writer.id !== id)
      throw new UnauthorizedException('삭제 권한이 없습니다.');

    return this.boardsRepository.delete({ id: boardId });
  }

  async updateBoard({ updateBoardInput, id, boardId }) {
    const prevBoard = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: ['products', 'writer'],
    });
    if (prevBoard.writer.id !== id)
      throw new UnauthorizedException('수정 권한이 없습니다.');
    // const { createAt } = prevBoard;
    const prevProducts = prevBoard.products;
    const { updateProductInputs } = updateBoardInput;
    const products = await this.productsService.updateProducts({
      updateProductInputs: updateProductInputs.map((e) => {
        const found = prevProducts.find((el) => el.url === e.url);
        if (found) {
          e.picture = found.picture;
        }
        return e;
      }),
    });
    const hashtags = await this.hashtagsService.createHashtags({
      ...updateBoardInput,
    });
    await this.productsService.deleteProducts({ id: boardId });
    // await this.boardsRepository.delete({ id: boardId });

    return this.boardsRepository.save({
      id: boardId,
      ...updateBoardInput,
      products,
      hashtags,
      // createAt,
    });
  }
}
