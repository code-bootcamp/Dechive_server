import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;
}

// @InputType()
// export class CreateProductInputs {
//   @Field(() => [CreateProductInput])
//   createProductInput: CreateProductInput[];
// }
