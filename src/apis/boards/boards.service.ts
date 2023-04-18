import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService,
  ) {}

  async createBoard({ createBoardInput, id }): Promise<Board> {
    // image 업로드 후 링크 받아오기

    // bulk insert 활용한 최적화 필요
    const hashtags = await this.hashtagsService.createHashtags({
      ...createBoardInput,
    });
    const products = await this.productsService.createProducts({
      ...createBoardInput,
    });
    return this.boardsRepository.save({
      ...createBoardInput,
      writer: { id },
      hashtags,
      products,
    });
  }
}
