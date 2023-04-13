import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Youtube } from './dto/youtube.dto';
import e from 'express';

@Injectable()
export class YoutubeService {
  async searchVideos(): Promise<Youtube[]> {
    try {
      const apiClient = axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3',
        params: { key: process.env.YOUTUBE_APP_API_KEY },
      });
      const response = await apiClient.get('search', {
        params: {
          part: 'snippet',
          q: 'desk setup', //desk setup 검색
          type: 'video',
          maxResults: 12, //12개
          fields: 'items(id(videoId),snippet(thumbnails(high(url))))', //비디오 아이디와 썸네일만 조회
        },
      });
      const result: Youtube[] = [];
      return Promise.all(
        response.data.items.map(async (e) => {
          result.push({
            videoUrl: `www.youtube.com/watch?v=${e.id.videoId}`,
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
          });
        }),
      ).then(() => result);
    } catch (error) {
      console.log(error);
    }
  }
}
