import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Youtube } from './dto/youtube.dto';
import { Cache } from 'cache-manager';
import { requestYoutubeAPI } from 'src/commons/util/getYoutube';

@Injectable()
export class YoutubeService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  async findYoutubeFromCache(): Promise<Youtube[]> {
    let youtube = await this.cacheManager.get('youtube');
    if (!youtube) {
      youtube = [].concat(
        ...(await Promise.all([
          requestYoutubeAPI({
            keyword: '데스크 셋업',
          }),
          requestYoutubeAPI({
            keyword: 'desk setup',
          }),
        ])),
      );
      await this.cacheManager.set('youtube', youtube, { ttl: 86400 });
    }
    const set = new Set();
    while (set.size !== 12) {
      set.add(Math.floor(Math.random() * 100));
    }
    return [...set].map((e: number) => youtube[e]);
  }
}
