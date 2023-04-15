import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class MatchAuthInput {
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  authNumber: string;
}
