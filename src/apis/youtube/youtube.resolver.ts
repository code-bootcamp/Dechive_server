import { Query, Resolver } from '@nestjs/graphql';
import { YoutubeService } from './youtube.service';
import { Youtube } from './dto/youtube.dto';

@Resolver()
export class YoutubeResolver {
  constructor(
    private readonly youtubeService: YoutubeService, //
  ) {}
  @Query(() => [Youtube])
  fetchYoutube(): Promise<Youtube[]> {
    return this.youtubeService.searchVideos();
  }
}
