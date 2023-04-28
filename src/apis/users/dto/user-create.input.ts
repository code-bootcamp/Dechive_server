import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  password?: User['password'];

  @Field(() => String)
  jobGroup: User['jobGroup'];

  @Field(() => String, { nullable: true })
  provider: User['provider'];
}
