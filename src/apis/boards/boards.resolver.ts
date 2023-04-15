import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { getOgImageUrl } from 'src/commons/util/getOgImageUrl';
import { Product } from '../products/entities/product.entity';
import { CreateProductInput } from '../products/dto/product-create.input';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { CreateHashtagInput } from '../hashtags/dto/hashtag-create.input';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly BoardsService: BoardsService, //
  ) {}
  @Query(() => String)
  fetchBoard() {
    return 'a';
  }

  @Mutation(() => Product)
  createProducts(
    @Args('product') createProductInputs: CreateProductInput, //
  ): Promise<Product> {
    return this.BoardsService.createProducts({ createProductInputs });
  }

  @Mutation(() => Hashtag)
  createHashtag(
    @Args('hashtag') hashtag: string, //
  ): Promise<Hashtag> {
    return this.BoardsService.createHashtag({ hashtag });
  }

  @Mutation(() => [Hashtag])
  createHashtags(
    @Args('createHashtagInputs') createHashtagInputs: CreateHashtagInput, //
  ): Promise<[Hashtag]> {
    return this.BoardsService.createHashtags({ createHashtagInputs });
  }

  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ): Promise<Board> {
    return this.BoardsService.createBoard({ createBoardInput });
  }

  @Mutation(() => String)
  async getOg(
    @Args('url') url: string, //
  ): Promise<string> {
    return await getOgImageUrl({ url });
  }
}
