import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  password: User['password'];
}
