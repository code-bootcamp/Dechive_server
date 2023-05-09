import { Field, InputType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

@InputType()
export class FetchFollowings {
  @Field(() => String)
  userid: User['id'];

  @Field(() => String, { nullable: true })
  loginUserid?: User['id'];
}
