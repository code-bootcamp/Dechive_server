import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/board-create.input';
import { getOgImageUrl } from 'src/commons/util/getOgImageUrl';
import { Product } from '../products/entities/product.entity';
import { CreateProductInput } from '../products/dto/product-create.input';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { CreateHashtagInput } from '../hashtags/dto/hashtag-create.input';
import { UseGuards } from '@nestjs/common';
import { DechiveAuthGuard } from '../auth/guards/auth.guards';
import { IContext } from 'src/commons/interfaces/context';
import { HashtagsService } from '../hashtags/hashtags.service';
import { ProductsService } from '../products/products.service';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //

    private readonly hashtagsService: HashtagsService,

    private readonly productsService: ProductsService, //
  ) {}

  @Query(() => String)
  fetchBoard() {
    return 'Test';
  }

  @Mutation(() => Product)
  createProducts(
    @Args('product') createProductInputs: CreateProductInput, //
  ): Promise<Product> {
    return this.productsService.createProducts({ createProductInputs });
  }

  @Mutation(() => [Hashtag])
  createHashtags(
    @Args('createHashtagInputs') createHashtagInputs: CreateHashtagInput, //
  ): Promise<[Hashtag]> {
    return this.hashtagsService.createHashtags({ createHashtagInputs });
  }

  // @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    // @Context() context: IContext,
  ): Promise<Board> {
    // console.log(context.req.user);
    return this.boardsService.createBoard({ createBoardInput });
  }
}
