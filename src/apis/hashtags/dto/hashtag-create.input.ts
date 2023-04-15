import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateHashtagInput {
  @Field(() => String)
  hashtag: string;
}
