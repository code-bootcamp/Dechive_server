import { Field, InputType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

@InputType()
export class LoginInput {
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  password: User['password'];
}
