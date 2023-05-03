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
  IUsersServiceCheckEmail,
  IUsersServiceCreateUser,
  IUsersServiceDeleteUser,
  IUsersServiceFetchUser,
  IUsersServiceFindByUsers,
  IUsersServiceFindeOne,
  IUsersServiceFindOneEmail,
  IUsersServiceFollowing,
  IUSersServiceFollowingBoards,
  IUsersServiceHashPassword,
  IUsersServiceIsEmail,
  IUsersServiceMathAuth,
  IUsersServiceResetPassword,
  IUsersServiceSocialLoginProviderUpdate,
  IUsersServiceUpdateUser,
} from './interfaces/user-service.interface';
import { SnsAccountService } from '../snsAccount/snsAccount.service';
import { MailerService } from '@nestjs-modules/mailer';
import { dechiveTemplate, RanmomNumber } from 'src/commons/util/sendTemplate';
import { Cache } from 'cache-manager';
import { FetchUser } from './dto/user-fetch.return-type';
import { PicturesService } from '../pictures/pictures.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //

    private readonly snsAccountService: SnsAccountService,

    private readonly mailerService: MailerService,

    private readonly picturesService: PicturesService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOneUser({ id }: IUsersServiceFindeOne): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'snsAccounts',
        'followings',
        'followees',
        'like',
        'boards',
        'boards.hashtags',
        'boards.products',
        'boards.pictures',
      ],
      order: {
        boards: {
          createdAt: 'DESC',
        },
      },
    });

    if (!user) throw new ConflictException('등록 되지 않은 유저 입니다');
    user['followeesCount'] = user.followees.length;
    user['followingsCount'] = user.followings.length;
    return user;
  }

  async fetchUser({ id }: IUsersServiceFetchUser): Promise<FetchUser> {
    const user = await this.findOneUser({ id });

    return {
      user,
      boardCount: user.boards.length,
    };
  }

  findByUsers({ users }: IUsersServiceFindByUsers): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In(users) },
      relations: ['followings', 'followees'],
    });
  }

  followingBoards({ users }: IUSersServiceFollowingBoards): Promise<User[]> {
    return this.usersRepository.find({
      where: { id: In(users) },
      relations: ['boards', 'boards.writer', 'boards.pictures'],
      order: { boards: { createdAt: 'DESC' } },
      take: 12,
    });
  }

  findByNick({ nickName }): Promise<string[]> {
    return this.usersRepository
      .findOne({
        where: { nickName },
        select: { boards: true },
        relations: ['boards'],
      })
      .then((e) => (e ? e.boards.map((el) => el.id) : []));
  }

  findByJob({ jobGroup }): Promise<string[]> {
    return this.usersRepository
      .findOne({
        where: { jobGroup },
        select: { boards: true },
        relations: ['boards'],
      })
      .then((e) => (e ? e.boards.map((el) => el.id) : []));
  }

  findOneEmail({ email }: IUsersServiceFindOneEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async checkEmail({ email }: IUsersServiceCheckEmail): Promise<User> {
    const checkEmail = await this.findOneEmail({ email });

    if (!checkEmail) throw new ConflictException('등록되지 않은 회원 입니다.');

    return checkEmail;
  }

  async isEamil({ email }: IUsersServiceIsEmail): Promise<User> {
    const isEmail = await this.findOneEmail({ email });

    if (isEmail) throw new ConflictException('이미 사용중인 이메일 입니다.');

    return isEmail;
  }

  hashPassword({
    password,
  }: IUsersServiceHashPassword): Promise<User['password']> {
    return bcrypt.hash(password, 10);
  }

  async createUser({
    createUserInput,
  }: IUsersServiceCreateUser): Promise<User> {
    const { email, password } = createUserInput;

    await this.isEamil({ email });
    createUserInput['nickName'] = getRandomNickName();

    if (createUserInput?.provider) {
      return this.usersRepository.save({
        ...createUserInput,
        password: await this.hashPassword({
          password: process.env.RANDOMPASSWORD,
        }),
      });
    }

    return this.usersRepository.save({
      ...createUserInput,
      password: await this.hashPassword({ password }),
    });
  }

  socialLoginProviderUpdate({
    id,
    provider,
  }: IUsersServiceSocialLoginProviderUpdate): Promise<User> {
    return this.usersRepository.save({ id, provider });
  }

  async updateUser({
    updateUserInput,
    id,
  }: IUsersServiceUpdateUser): Promise<User> {
    const user = await this.findOneUser({ id });

    if (updateUserInput.picture && updateUserInput.picture !== user.picture) {
      this.picturesService.storageDelete({
        storageDelet: user.picture.split(process.env.GCP_BUCKET + '/')[1],
      });
    }

    if (user.nickName === updateUserInput.nickName)
      throw new ConflictException('이미 사용중인 닉네임 입니다.');

    let snsAccounts;
    if (updateUserInput.snsAccount) {
      const { snsAccount } = updateUserInput;

      const snsAccountNames = await this.snsAccountService.find({
        id: user.id,
      });

      const insertSns = [];
      const snsObj = {};
      snsAccountNames.forEach((el) => {
        snsObj[el.sns] = el.id;
      });

      snsAccount.forEach((el) => {
        const isExists = snsAccountNames.find((prevEl) => el === prevEl.sns);
        if (!isExists) insertSns.push({ sns: el });
        if (snsObj[el]) delete snsObj[el];
      });

      for (const id in snsObj) {
        this.snsAccountService.deleteSnsAccount({ id: snsObj[id] });
      }

      const newqqq = await this.snsAccountService.bulkInsert({
        snsAcounts: insertSns,
      });
      snsAccounts = [...snsAccountNames, ...newqqq.identifiers];

      // bulkInsert는 id 값만 반환 -> Graphql (snsAccounts.sns을 볼 수 없다)
      const qqq = await this.usersRepository.save({
        ...user,
        ...updateUserInput,
        snsAccounts,
      });

      // 최종 수정본은 한번더 조회한뒤 보내줌( 프론트 협의 필요 )
      return {
        ...qqq,
        snsAccounts: await this.snsAccountService.find({ id: user.id }),
      };
    }
    return await this.usersRepository.save({
      ...user,
      ...updateUserInput,
    });
  }

  async authEmail({
    authEmailInput,
  }: IUsersServiceAuthEamil): Promise<boolean> {
    const { email, authCheck } = authEmailInput;
    if (authCheck) await this.isEamil({ email });
    else await this.checkEmail({ email });

    const authNumber = RanmomNumber();

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
    const user = await this.findOneEmail({ email });

    await this.usersRepository.save({
      ...user,
      password: await this.hashPassword({ password }),
    });
    return true;
  }

  async deleteUser({ id }: IUsersServiceDeleteUser): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });

    return result.affected ? true : false;
  }

  async following({ id, following }: IUsersServiceFollowing): Promise<User> {
    const user = await this.findOneUser({ id });
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
    const user = await this.findOneUser({ id });
    const _user = await this.findOneUser({ id: followingid });

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
