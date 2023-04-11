import { Module } from '@nestjs/common';
import { YoutubeResolver } from './youtubes.resolver';
import { YoutubeService } from './youtubes.service';

@Module({
  imports: [],
  providers: [
    YoutubeResolver, //
    YoutubeService,
  ],
})
export class YoutubeModule {}
