import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  picture: string;
}
