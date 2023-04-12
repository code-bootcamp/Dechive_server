import { Args, Query, Resolver } from '@nestjs/graphql';
import { YoutubeService } from './youtube.service';

@Resolver()
export class YoutubeResolver {
  constructor(
    private readonly youtubeService: YoutubeService, //
  ) {}
  // @Query(() => [{ videoUrl: String, thumbnailUrl: String }])
  @Query(() => [String])
  fetchYoutube(
    @Args('keyword') keyword: string, //
  ): Promise<string[]> {
    //리턴 타입지정
    return this.youtubeService.searchVideos({ keyword });
  }
}
