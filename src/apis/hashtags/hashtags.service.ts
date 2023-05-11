import { Like, Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  IHashtagsServiceCreate,
  IHashtagsServiceFindByHash,
} from './interfaces/hashtags-service.interface';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagsRepository: Repository<Hashtag>, //
  ) {}

  findByHash({
    hashtag, //
  }: IHashtagsServiceFindByHash): Promise<string[]> {
    return this.hashtagsRepository
      .findOne({
        where: { hashtag: Like(`%${hashtag}%`) },
        select: { boards: true },
        relations: ['boards'],
      })
      .then((e) => (e ? e.boards.map((el) => el.id) : []));
  }

  createHashtags({
    hashtags, //
  }: IHashtagsServiceCreate): Promise<Hashtag[]> {
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
        }
        return this.hashtagsRepository.save({ hashtag });
      }),
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
