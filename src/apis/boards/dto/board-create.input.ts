import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Board } from '../entities/board.entity';
import { CreateProductInput } from 'src/apis/products/dto/product-create.input';
import { CreateHashtagInput } from 'src/apis/hashtags/dto/hashtag-create.input';

@InputType()
export class CreateBoardInput extends OmitType(
  Board, //
  [
    'id',
    'comments',
    'viewers',
    'likers',
    'createAt',
    'hashtags',
    'products',
    'user',
  ],
  InputType,
) {
  @Field(() => [CreateHashtagInput], { nullable: true })
  createHashtagInputs: CreateHashtagInput[];

  @Field(() => [CreateProductInput])
  createProductInputs: CreateProductInput[];
}
