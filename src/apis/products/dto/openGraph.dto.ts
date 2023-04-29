import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OpenGraph {
  @Field(() => String)
  name: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => String)
  description: string;
}
