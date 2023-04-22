import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReplyInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  commentid: string;
}
