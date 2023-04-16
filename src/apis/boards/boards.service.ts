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

  async createBoard({ createBoardInput }): Promise<Board> {
    // 현재 로그인한 유저로 부터 writer 받아오기
    // 이미지 업로드 후 링크 받아오기

    // bulk insert 활용한 최적화 필요
    // liker, viewer, writer UserTable과 연결 필요
    // UserGaurd 적용 필요

    const { createProductInputs, createHashtagInputs } = createBoardInput;
    const hashtags = this.hashtagsService.createHashtags({
      createHashtagInputs,
    });
    const products = await this.productsService.createProducts({
      createProductInputs,
    });
    return await this.boardsRepository.save({
      ...createBoardInput,
      products,
      hashtags,
    });
  }
}
