import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { Youtube } from 'src/apis/youtube/dto/youtube.dto';

export const requestYoutubeAPI = async ({ keyword }): Promise<Youtube[]> => {
  try {
    const apiClient = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      params: { key: process.env.YOUTUBE_APP_API_KEY },
    });
    const response = await apiClient.get('search', {
      params: {
        part: 'snippet',
        q: keyword, //keyword 검색
        type: 'video',
        maxResults: 50,
        fields: 'items(id(videoId),snippet(title,thumbnails(high(url))))', //비디오 아이디와 썸네일만 조회
      },
    });
    return Promise.all(
      response.data.items.map(async (e) => {
        const chars = {
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
        };
        const regex = /&(amp|lt|gt|quot|#39);/g;
        return {
          title: regex.test(e.snippet.title)
            ? e.snippet.title.replace(regex, (matched) => chars[matched])
            : e.snippet.title,
          videoUrl: `https://www.youtube.com/watch?v=${e.id.videoId}`,
          thumbnailUrl: e.snippet.thumbnails.high.url,
          // 비디오 아이디로 조회수 조회
          views: (
            await apiClient.get('videos', {
              params: {
                part: 'statistics',
                id: e.id.videoId,
                fields: 'items(statistics(viewCount))',
              },
            })
          ).data.items[0].statistics.viewCount,
        };
      }),
    );
  } catch (error) {
    console.log('유튜브 API에러');
    throw new HttpException('YoutubeAPI is Locked', 423);
  }
};
