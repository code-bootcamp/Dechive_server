import { Args, Query, Resolver } from '@nestjs/graphql';
import { YoutubeService } from './youtube.service';

@Resolver()
export class YoutubeResolver {
  constructor(private readonly youtubeService: YoutubeService) {}
  // @Query(() => [{ videoUrl: String, thumbnailUrl: String }])
  @Query(() => [String])
  async fetchYoutube(
    @Args('keyword') keyword: string, //
  ) {
    const result = await this.youtubeService.searchVideos(keyword);
    return result;
  }
}
