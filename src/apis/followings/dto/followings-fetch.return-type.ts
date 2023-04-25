import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
export class FetchFollowing {
  @Field(() => [User])
  user: User[];

  @Field(() => Boolean)
  following: boolean;
}
