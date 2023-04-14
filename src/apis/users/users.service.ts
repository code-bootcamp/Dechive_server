import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';
import {
  IUsersServiceCreateUser,
  IUsersServiceFindeOne,
  IUsersServiceFindOneEmail,
  IUsersServiceHashPassword,
  IUsersServiceUpdateUser,
} from './interfaces/user-service.interface';
import { SnsAccountService } from '../snsAccount/snsAccount.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //

    private readonly snsAccountService: SnsAccountService,
  ) {}

  async findeOneUser({ id }: IUsersServiceFindeOne): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['snsAccounts'],
    });

    if (!user) throw new ConflictException('등록 되지 않은 유저 입니다');

    return user;
  }

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

  async updateUser({
    updateUserInput,
  }: IUsersServiceUpdateUser): Promise<User> {
    let user = await this.findeOneUser({ id: updateUserInput.id });

    // image 업로드 하면 작성
    // if(updateUserInput.picture !== user.picture)

    let temp;
    if (updateUserInput?.snsAccount) {
      const result = [];

      user.snsAccounts.forEach(async (el) => {
        if (el.sns === updateUserInput.snsAccount) {
          result.push(el.sns);
        }
      });

      if (result.length) {
        await this.snsAccountService.deleteSnsAccount({
          sns: result[0],
          user,
        });
      } else {
        temp = await this.snsAccountService.createSnsAccount({
          sns: updateUserInput.snsAccount,
          user,
        });
      }
    }
    if (!temp) user = await this.findeOneUser({ id: updateUserInput.id });
    const snsAccount = [temp, ...user.snsAccounts];

    if (user.nickName === updateUserInput.nickName)
      throw new ConflictException('이미 사용중인 닉네임 입니다.');

    return this.usersRepository.save({
      ...user,
      ...updateUserInput,
      snsAccounts: temp ? snsAccount : [...user.snsAccounts],
    });
  }
}
