import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, InsertResult, Repository } from 'typeorm';
import { SnsAccount } from './entities/snsAccount.entity';
import {
  ISnsAccountServiceCreate,
  ISnsAccountServiceDelete,
  ISnsAccountServiceFindeSnsNames,
} from './interfaces/snsAccount-service.interface';

@Injectable()
export class SnsAccountService {
  constructor(
    @InjectRepository(SnsAccount)
    private readonly snsAccountRepository: Repository<SnsAccount>, //
  ) {}

  find({ id }: ISnsAccountServiceFindeSnsNames): Promise<SnsAccount[]> {
    return this.snsAccountRepository.find({
      where: { user: { id } },
    });
  }

  bulkInsert({ snsAcounts }: ISnsAccountServiceCreate): Promise<InsertResult> {
    return this.snsAccountRepository.insert([...snsAcounts]);
  }

  deleteSnsAccount({ id }: ISnsAccountServiceDelete): Promise<DeleteResult> {
    return this.snsAccountRepository.delete({ id });
  }
}
