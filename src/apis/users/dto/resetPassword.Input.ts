import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class ResetPasswordInput {
  @IsEmail()
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  password: User['password'];
}
