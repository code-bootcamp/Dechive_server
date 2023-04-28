import { HttpException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ogs = require('open-graph-scraper');

export function getOpenGraph({ url }) {
  const options = {
    url,
    onlyGetOpenGraphInfo: true,
    timeout: { request: 500 },
  };
  return ogs(options)
    .then((data) => {
      const { error, result } = data;
      console.log(error);
      return error
        ? null
        : {
            name: result.ogTitle,
            imageUrl: result.ogImage.url,
            description: result.ogDescription,
          };
    })
    .catch(() => {
      return {
        name: '',
        imageUrl: '',
        description: '',
      };
    });
}
