import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class YoutubeService {
  async searchVideos(keyword: string) {
    try {
      const apiClient = axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3',
        params: { key: process.env.YOUTUBE_APP_API_KEY },
      });
      const response = await apiClient.get('search', {
        params: {
          part: 'snippet',
          q: keyword,
          type: 'video',
          maxResults: 10,
        },
      });
      const result = [];
      for (const item of response.data.items) {
        // result.push({
        //   videoUrl: `www.youtube.com/watch?v=${item.id.videoId}`,
        //   thumbnailUrl: item.snippet.thumbnails.high.url,
        // });
        result.push(`www.youtube.com/watch?v=${item.id.videoId}`);
        result.push(item.snippet.thumbnails.high.url);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
