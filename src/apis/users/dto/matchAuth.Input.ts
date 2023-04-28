import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class MatchAuthInput {
  @IsEmail(undefined, {
    message: '이메일 형식이 올바르지 않습니다.',
  })
  @Field(() => String)
  email: User['email'];

  @Field(() => String)
  authNumber: string;
}
