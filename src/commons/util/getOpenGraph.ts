import axios from 'axios';
import { load } from 'cheerio';
import { parse } from 'parse-open-graph';
import { HttpException } from '@nestjs/common';
import { OpenGraph } from 'src/apis/products/dto/opengraph.return-type';

export const getOpenGraph = async ({ url }): Promise<OpenGraph> => {
  const html = (await getHTML({ url })).data;
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
const getHTML = async ({ url }) => {
  return axios
    .get(url, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8',
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
