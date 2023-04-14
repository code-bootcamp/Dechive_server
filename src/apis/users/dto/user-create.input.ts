import { Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  email: User['email'];

  @Field(() => String, { nullable: true })
  password: User['password'];
}
