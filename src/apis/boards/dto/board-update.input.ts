import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CreateBoardInput } from './board-create.input';
import { UpdateProductInput } from 'src/apis/products/dto/product-update.input';

@InputType()
export class UpdateBoardInput extends OmitType(
  CreateBoardInput, //
  ['createProductInputs'],
  InputType,
) {
  @Field(() => [UpdateProductInput])
  updateProductInputs: UpdateProductInput[];
}
