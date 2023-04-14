import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SnsAccount } from './entities/snsAccount.entity';
import {
  ISnsAccountServiceCreate,
  ISnsAccountServiceDelete,
} from './interfaces/snsAccount-service.interface';

@Injectable()
export class SnsAccountService {
  constructor(
    @InjectRepository(SnsAccount)
    private readonly snsAccountRepository: Repository<SnsAccount>, //
  ) {}

  deleteSnsAccount({
    sns,
    user,
  }: ISnsAccountServiceDelete): Promise<DeleteResult> {
    return this.snsAccountRepository.delete({ sns, user });
  }

  createSnsAccount({ sns }: ISnsAccountServiceCreate): Promise<SnsAccount> {
    return this.snsAccountRepository.save({ sns });
  }
}
