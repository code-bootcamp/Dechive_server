import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { Product } from '../products/entities/product.entity';
import { getOgImageUrl } from 'src/commons/util/getOgImageUrl';
import { CreateProductInput } from '../products/dto/product-create.input';
import { CreateHashtagInput } from '../hashtags/dto/hashtag-create.input';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>, //
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async createHashtags({ createHashtagInputs }): Promise<[Hashtag]> {
    const { hashtags } = createHashtagInputs;
    return createHashtagInputs.map(
      async (createHashtagInput: CreateHashtagInput) => {
        const { hashtag } = createHashtagInput;
        const prevHashtag = await this.hashtagsRepository.findOne({
          where: { hashtag },
        });
        if (prevHashtag) {
          return prevHashtag;
        } else {
          return this.hashtagsRepository.save({ hashtag });
        }
      },
    );
  }

  async createHashtag({ hashtag }): Promise<Hashtag> {
    const prevHashtag = await this.hashtagsRepository.findOne({
      where: { hashtag },
    });
    if (prevHashtag) {
      return prevHashtag;
    } else {
      return this.hashtagsRepository.save({ hashtag });
    }
  }

  async createProducts({ createProductInputs }): Promise<Product> {
    return Promise.all(
      createProductInputs.map(
        async (createProductInput: CreateProductInput) =>
          await this.productsRepository.save({
            ...createProductInput,
            picture: await getOgImageUrl({ ...createProductInput }),
          }),
      ),
    ).then();
  }

  async createBoard({ createBoardInput }): Promise<Board> {
    // 현재 로그인한 유저로 부터 writer 받아오기
    // 이미지 업로드 후 링크 받아오기
    const { createProductInputs, createHashtagInputs } = createBoardInput;
    const hashtags = this.createHashtags({ createHashtagInputs });
    const products = this.createProducts({ createProductInputs });
    return await this.boardsRepository.save({
      ...createBoardInput,
      products,
      hashtags,
    });
  }
}
