import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  nickName: User['nickName'];

  @Field(() => String, { nullable: true })
  intro: User['intro'];

  @Field(() => String, { nullable: true })
  picture: User['picture'];

  @Field(() => [String], { nullable: true })
  snsAccount: string[];

  @Field(() => String, { nullable: true })
  jobGroup: string;
}
