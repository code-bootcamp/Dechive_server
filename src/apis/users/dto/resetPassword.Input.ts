import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches } from 'class-validator';
import { User } from '../entities/user.entity';

@InputType()
export class ResetPasswordInput {
  @IsEmail(undefined, {
    message: '이메일 형식이 올바르지 않습니다.',
  })
  @Field(() => String)
  email: User['email'];

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,13}$/, {
    message: '비밀번호 형식이 올바르지 않습니다.',
  })
  @Field(() => String)
  password: User['password'];
}
