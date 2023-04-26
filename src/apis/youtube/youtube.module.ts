import { CacheModule, Module } from '@nestjs/common';
import { YoutubeResolver } from './youtube.resolver';
import { YoutubeService } from './youtube.service';

@Module({
  imports: [],
  providers: [
    YoutubeResolver, //
    YoutubeService,
  ],
})
export class YoutubeModule {}
