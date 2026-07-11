import 'dotenv/config';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function run() {
  if (!process.env.APIFY_TOKEN) {
    throw new Error('APIFY_TOKEN is not set. Copy .env.example to .env and add your token.');
  }

  const input = {
    startUrls: [
      { url: 'https://www.landandfarm.com/search/South-Carolina-land-for-sale/' },
    ],
    stateFilter: 'SC',
    propertyType: 'farms',
    minPrice: 0,
    maxPrice: 0,
    minAcres: 0,
    maxAcres: 0,
    maxItems: 100,
    proxyConfiguration: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL'],
    },
  };

  const { defaultDatasetId } = await client.actor('getascraper/landandfarm-scraper').call(input);

  const { items } = await client.dataset(defaultDatasetId).listItems({ limit: 10 });

  console.table(items);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
