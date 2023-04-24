import { Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '../boards/entities/board.entity';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>, //
  ) {}

  findByHash({ keyword }): Promise<Board[]> {
    return this.hashtagsRepository
      .findOne({
        where: { hashtag: `#${keyword}` },
        select: { boards: true },
        relations: [
          'boards',
          'boards.writer',
          'boards.products',
          'boards.comments',
          'boards.hashtags',
          'boards.likers',
          'boards.pictures',
        ],
      })
      .then((e) => e?.boards)
      .catch();
  }

  createHashtags({ hashtags }): Promise<Hashtag[]> {
    return Promise.all(
      hashtags.map(async (hashtagWithOutSharp: string) => {
        let hashtag = hashtagWithOutSharp;
        if (hashtagWithOutSharp[0] !== '#') {
          hashtag = `#${hashtagWithOutSharp}`;
        }
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

  findAllboardid({ id }) {
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
