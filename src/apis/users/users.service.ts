import {
  BadRequestException,
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { getRandomNickName } from 'src/commons/util/getRandomNickname';
import {
  IUserServiceUnfollowing,
  IUsersServiceAuthEamil,
  IUsersServiceCreateUser,
  IUsersServiceDeleteUser,
  IUsersServiceFindByUsers,
  IUsersServiceFindeOne,
  IUsersServiceFindOneEmail,
  IUsersServiceFollowing,
  IUsersServiceHashPassword,
  IUsersServiceIsEmail,
  IUsersServiceMathAuth,
  IUsersServiceResetPassword,
  IUsersServiceUpdateUser,
} from './interfaces/user-service.interface';
import { SnsAccountService } from '../snsAccount/snsAccount.service';
import { MailerService } from '@nestjs-modules/mailer';
import { dechiveTemplate } from 'src/commons/util/sendTemplate';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //

    private readonly snsAccountService: SnsAccountService,

    private readonly mailerService: MailerService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findeOneUser({ id }: IUsersServiceFindeOne): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['snsAccounts', 'followings', 'followees'],
    });

    if (!user) throw new ConflictException('등록 되지 않은 유저 입니다');
    return user;
  }

  async findByUsers({ users }: IUsersServiceFindByUsers): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In(users) },
    });
  }

  async findOneEamil({ email }: IUsersServiceFindOneEmail): Promise<User> {
    if (!email || !email.includes('@'))
      throw new ConflictException('올바르지 않은 이메일 형식입니다.');

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) throw new ConflictException('없는 회원 입니다.');
    return user;
  }

  async isEamil({ email }: IUsersServiceIsEmail): Promise<User> {
    if (!email || !email.includes('@'))
      throw new ConflictException('올바르지 않은 이메일 형식입니다.');

    const isEmail = await this.usersRepository.findOne({ where: { email } });

    if (isEmail) throw new ConflictException('이미 사용중인 이메일 입니다.');
    return isEmail;
  }

  hashPassword({
    password,
  }: IUsersServiceHashPassword): Promise<User['password']> {
    if (!password) throw new BadRequestException('비밀번호 입력해 주세요');
    return bcrypt.hash(password, 10);
  }

  async createUser({
    createUserInput,
  }: IUsersServiceCreateUser): Promise<User> {
    const { email } = createUserInput;

    await this.isEamil({ email });

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
    id,
  }: IUsersServiceUpdateUser): Promise<User> {
    let user = await this.findeOneUser({ id: id });

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
        });
      }
    }

    if (!temp) user = await this.findeOneUser({ id });
    const snsAccount = [temp, ...user.snsAccounts];

    if (user.nickName === updateUserInput.nickName)
      throw new ConflictException('이미 사용중인 닉네임 입니다.');

    return this.usersRepository.save({
      ...user,
      ...updateUserInput,
      snsAccounts: temp ? snsAccount : [...user.snsAccounts],
    });
  }

  async authEmail({ email }: IUsersServiceAuthEamil): Promise<boolean> {
    await this.isEamil({ email });

    const authNumber = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      '0',
    );

    return this.mailerService
      .sendMail({
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Dechive 인증 번호입니다',
        html: dechiveTemplate(authNumber),
      })
      .then(() => {
        this.cacheManager.set(email, authNumber, { ttl: 180 });
        return true;
      })
      .catch((e) => {
        throw new InternalServerErrorException('이메일 인증번호 전송 실패');
      });
  }

  async matchAuthNumber({
    matchAuthInput,
  }: IUsersServiceMathAuth): Promise<boolean> {
    const { email, authNumber } = matchAuthInput;
    const eamilAuthNumber = await this.cacheManager.get(email);

    if (eamilAuthNumber !== authNumber)
      throw new BadRequestException('인증번호가 일치 하지 않습니다.');

    this.cacheManager.del(email);
    return true;
  }

  async resetUserPassword({
    resetPasswordInput,
  }: IUsersServiceResetPassword): Promise<boolean> {
    const { email, password } = resetPasswordInput;
    const user = await this.findOneEamil({ email });
    const hashPassword = await this.hashPassword({ password });

    await this.usersRepository.save({ ...user, password: hashPassword });
    return true;
  }

  async deleteUser({ id }: IUsersServiceDeleteUser): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });

    return result.affected ? true : false;
  }

  async following({ id, following }: IUsersServiceFollowing): Promise<User> {
    const user = await this.findeOneUser({ id });
    const followings = [...user.followings, following];

    return this.usersRepository.save({
      ...user,
      followings,
    });
  }

  async unfollowing({
    followingid,
    id,
  }: IUserServiceUnfollowing): Promise<User> {
    const user = await this.findeOneUser({ id });
    const _user = await this.findeOneUser({ id: followingid });

    await Promise.all([
      (user.followings = user.followings.filter(
        (el) => el.followingid !== followingid,
      )),
      (_user.followees = _user.followees.filter((el) => el.followeeid !== id)),
    ]);
    await this.usersRepository.save(_user);
    return this.usersRepository.save(user);
  }
}
