import axios from 'axios';
import { load } from 'cheerio';
import { parse } from 'parse-open-graph';
import { HttpException } from '@nestjs/common';
import { OpenGraph } from 'src/apis/products/dto/opengraph.return-type';

export const getOpenGraph = async ({ url }): Promise<OpenGraph> => {
  const response = await getHTML({ url });
  const contentType = response.headers['content-type'];
  const charset = contentType.includes('charset=')
    ? contentType.split('charset=')[1]
    : 'UTF-8';
  const decoder = new TextDecoder(charset);
  const html = decoder.decode(response.data);
  const $ = load(html);
  const meta = parse(
    $('meta[property]')
      .map((_, el) => ({
        property: $(el).attr('property'),
        content: $(el).attr('content'),
      }))
      .get(),
  );
  return {
    name: meta.og?.title ?? '',
    url: meta.og?.url ?? url,
    imageUrl: meta.og?.image[0]?.url ?? '',
    description: meta.og?.description ?? '',
  };
};
const getHTML = ({ url }) => {
  return axios
    .get(url, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ko,ko-KR,en,en-US',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64',
      },
      timeout: 5000,
    })
    .catch(() => {
      throw new HttpException('잘못된 주소입니다', 400);
    });
};
