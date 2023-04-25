import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
export class FetchFollowee {
  @Field(() => [User])
  user: User[];

  @Field(() => Boolean)
  followee: boolean;
}
