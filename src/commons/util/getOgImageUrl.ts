// eslint-disable-next-line @typescript-eslint/no-var-requires
const ogs = require('open-graph-scraper');

export async function getOgImageUrl({ url }) {
  const options = { url };
  return ogs(options).then((data) => {
    const { result } = data;
    // console.log('error:', error); // This returns true or false. True if there was an error. The error itself is inside the results object.
    // console.log('result:', result); // This contains all of the Open Graph results
    // console.log(result.ogImage.url); // This contains all of the Open Graph results
    // console.log('response:', response); // This contains the HTML of page
    return result.ogImage.url;
  });
}
