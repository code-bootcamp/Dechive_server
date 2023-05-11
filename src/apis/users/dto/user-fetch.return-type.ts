import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class FetchUser {
  @Field(() => User)
  user: User;

  @Field(() => Int)
  boardCount: number;
}
