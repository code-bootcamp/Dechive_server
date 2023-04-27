import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class AuthEmailInput {
  @Field(() => String)
  email: User['email'];

  @Field(() => Boolean)
  authCheck: boolean;
}
