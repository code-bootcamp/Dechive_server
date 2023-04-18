import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>, //
  ) {}

  async createHashtags({ hashtags }): Promise<[Hashtag]> {
    return hashtags.map(async (hashtagWithOutSharp: string) => {
      const hashtag = `#${hashtagWithOutSharp}`;
      console.log(hashtag);
      const prevHashtag = await this.hashtagsRepository.findOne({
        where: { hashtag },
      });
      if (prevHashtag) {
        return prevHashtag;
      } else {
        return this.hashtagsRepository.save({ hashtag });
      }
    });
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
