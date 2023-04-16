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

  @UseGuards(DechiveAuthGuard('access'))
  @Mutation(() => Board)
  createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    @Context() context: IContext,
  ): Promise<Board> {
    console.log(context.req.user);
    return this.BoardsService.createBoard({ createBoardInput });
  }

  @Mutation(() => String)
  async getOg(
    @Args('url') url: string, //
  ): Promise<string> {
    return await getOgImageUrl({ url });
  }
}
