import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';
import {
  IUsersServiceCreateUser,
  IUsersServiceFindOneEmail,
  IUsersServiceHashPassword,
} from './interfaces/user-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //
  ) {}

  async findOneEamil({ email }: IUsersServiceFindOneEmail): Promise<User> {
    if (!email || !email.includes('@'))
      throw new ConflictException('올바르지 않은 이메일 형식입니다.');

    const isEmail = await this.usersRepository.findOne({ where: { email } });

    if (isEmail) throw new ConflictException('이미 사용중인 이메일 입니다.');
    return isEmail;
  }

  hashPassword({
    password,
  }: IUsersServiceHashPassword): Promise<User['password']> {
    if (!password) throw new ConflictException('비밀번호 입력해 주세요');
    return bcrypt.hash(password, 10);
  }

  async createUser({
    createUserInput,
  }: IUsersServiceCreateUser): Promise<User> {
    const { email } = createUserInput;

    await this.findOneEamil({ email });

    const password = await this.hashPassword({
      password: createUserInput.password,
    });

    return this.usersRepository.save({
      ...createUserInput,
      password,
      nickName: getRandomNickName(),
    });
  }
}
