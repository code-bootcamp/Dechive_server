import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Board } from '../entities/board.entity';
import { CreateProductInput } from 'src/apis/products/dto/product-create.input';

@InputType()
export class CreateBoardInput extends OmitType(
  Board, //
  [
    'id',
    'comments',
    'viewers',
    'likers',
    'createdAt',
    'hashtags',
    'products',
    'writer',
  ],
  InputType,
) {
  @Field(() => [String], { nullable: true })
  hashtags: string[];

  @Field(() => [CreateProductInput])
  createProductInputs: CreateProductInput[];
}
