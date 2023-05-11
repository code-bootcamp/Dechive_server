import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class CreateProductInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  url: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => String, { nullable: true })
  description: string;
}
