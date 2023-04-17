import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateHashtagInput } from './dto/hashtag-create.input';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>, //
  ) {}

  async createHashtags({ createHashtagInputs }): Promise<[Hashtag]> {
    return createHashtagInputs.map(
      async (createHashtagInput: CreateHashtagInput) => {
        const { hashtag } = createHashtagInput;
        const prevHashtag = await this.hashtagsRepository.findOne({
          where: { hashtag },
        });
        if (prevHashtag) {
          return prevHashtag;
        } else {
          return this.hashtagsRepository.save({ hashtag });
        }
      },
    );
  }
  // Bulk insert 예시 코드
  // const a = await this.boardsRepository
  //   .createQueryBuilder('board')
  //   .insert()
  //   .into(Board)
  //   .values([
  //     { firstName: 'Timber', lastName: 'Saw' },
  //     { firstName: 'Phantom', lastName: 'Lancer' },
  //   ])
  //   .execute();

  // Qurey Builder update
  // await this.boardsRepository
  //   .createQueryBuilder()
  //   .update(User)
  //   .set({ firstName: 'Timber', lastName: 'Saw' })
  //   .where('id = :id', { id: 1 })
  //   .execute();
}
