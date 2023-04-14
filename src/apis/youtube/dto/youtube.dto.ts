import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Youtube {
  @Field(() => String)
  videoUrl: string;

  @Field(() => String)
  thumbnailUrl: string;

  @Field(() => Number)
  views: number;
}
