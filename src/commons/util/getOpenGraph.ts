import axios from 'axios';
import cheerio from 'cheerio';
import { parse } from 'parse-open-graph';

export async function getOpenGraph({ url }) {
  const html = (await getHTML({ url })).data;
  const $ = cheerio.load(html);
  const meta = $('meta[property]')
    .map((i, el) => ({
      property: $(el).attr('property'),
      content: $(el).attr('content'),
    }))
    .get();
  const result = parse(meta);
  const { title, description } = result.og;
  const imageUrl = result.og.image[0].url;
  url = result.og.url;
  return {
    name: title,
    url,
    imageUrl,
    description,
  };
}
const getHTML = ({ url }) => {
  return axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
      // 'Host': 'www.coupang.com',
      // 'Connection': 'keep-alive',
      // 'Pragma': 'no-cache',
      // Accept:
      //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      // 'Accept-Encoding': 'gzip, deflate, br',
      // 'Upgrade-Insecure-Requests': '1',
      // 'Cache-Control': 'no-cache',
    },
  });
};
