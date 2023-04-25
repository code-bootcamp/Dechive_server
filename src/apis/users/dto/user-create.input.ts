import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  password?: User['password'];

  @Field(() => String)
  jobGroup: User['jobGroup'];

  @Field(() => String)
  provider?: User['provider'];
}
