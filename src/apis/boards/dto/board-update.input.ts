import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CreateProductInput } from 'src/apis/products/dto/product-create.input';
import { CreateBoardInput } from './board-create.input';

@InputType()
export class UpdateBoardInput extends OmitType(
  CreateBoardInput, //
  ['createProductInputs'],
  InputType,
) {
  @Field(() => [CreateProductInput])
  updateProductInputs: CreateProductInput[];
}
