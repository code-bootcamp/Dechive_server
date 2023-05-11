import { Field, InputType } from '@nestjs/graphql';
import { CreateProductInput } from 'src/apis/products/dto/product-create.input';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  recommend: string;

  @Field(() => String)
  description: string;

  @Field(() => [String], { nullable: true })
  hashtags: string[];

  @Field(() => [CreateProductInput])
  createProductInputs: CreateProductInput[];

  @Field(() => [String])
  uploadFile: string[];
}
