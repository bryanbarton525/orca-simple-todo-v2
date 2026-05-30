import { parseRSS, RssMetadata } from '../../../lib/rss-client';

export async function getRssMetadata(slug: string): Promise<RssMetadata> {
  const url = `https://example.com/${slug}.xml`;
  return await parseRSS(url);
}