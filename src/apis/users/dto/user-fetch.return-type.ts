import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class FetchUserInput {
  @Field(() => String)
  userid: User['id'];

  @Field(() => String, { nullable: true })
  gestid: User['id'];
}

@ObjectType()
export class FetchUser {
  @Field(() => User)
  user: User;

  @Field(() => Int)
  boardCount: number;

  @Field(() => Int)
  followingCount: number;

  @Field(() => Int)
  followeeCount: number;

  @Field(() => Boolean)
  following: boolean;

  @Field(() => Boolean)
  followee: boolean;
}
