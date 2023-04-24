// eslint-disable-next-line @typescript-eslint/no-var-requires
const ogs = require('open-graph-scraper');

export async function getOgImageUrl({ url }) {
  const options = {
    url,
    onlyGetOpenGraphInfo: true,
    timeout: { request: 500 },
  };
  const result = await ogs(options)
    .then((data) => {
      const { error, result } = data;
      return error ? null : result.ogImage.url;
    })
    .catch();
  return result;
}
