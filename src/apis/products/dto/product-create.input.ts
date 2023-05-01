import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => String)
  description: string;
}
