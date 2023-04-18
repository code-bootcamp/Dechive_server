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

  createHashtags({ hashtags }): Promise<Hashtag[]> {
    return Promise.all(
      hashtags.map(async (hashtagWithOutSharp: string) => {
        let hashtag = hashtagWithOutSharp;
        if (hashtagWithOutSharp[0] !== '#') {
          hashtag = `#${hashtagWithOutSharp}`;
        }
        // console.log(hashtag);
        const prevHashtag = await this.hashtagsRepository.findOne({
          where: { hashtag },
        });
        if (prevHashtag) {
          return prevHashtag;
        } else {
          return this.hashtagsRepository.save({ hashtag });
        }
      }),
    );
  }

  findAllBoardId({ id }) {
    return this.hashtagsRepository.find({
      where: { boards: { id } },
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
