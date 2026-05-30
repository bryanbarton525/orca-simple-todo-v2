import { XMLParser } from 'fast-xml-parser';

export interface FeedItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  author?: string;
}

const parserOptions: XMLParser.Options = {
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
  trimValues: true,
};

const parser = new XMLParser(parserOptions);

export async function fetchFeed(url: string): Promise<FeedItem[]> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`Network error while fetching ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} while fetching ${url}`);
  }

  const text = await response.text();
  let parsed: any;
  try {
    parsed = parser.parse(text);
  } catch (err) {
    throw new Error(`Failed to parse XML from ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }

  const items: FeedItem[] = [];

  if (parsed.rss && parsed.rss.channel) {
    const channel = parsed.rss.channel;
    const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
    rawItems.forEach((it: any) => {
      items.push({
        title: it.title ?? '',
        link: it.link ?? '',
        description: it.description,
        pubDate: it.pubDate,
        author: it.author,
      });
    });
  } else if (parsed.feed) {
    const entries = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : parsed.feed.entry ? [parsed.feed.entry] : [];
    entries.forEach((e: any) => {
      items.push({
        title: e.title?.#text ?? e.title ?? '',
        link: e.link?.href ?? e.link?.[0]?.href ?? '',
        description: e.summary?.#text ?? e.content?.#text ?? '',
        pubDate: e.updated ?? e.published,
        author: e.author?.name ?? '',
      });
    });
  } else {
    throw new Error(`Unrecognized feed structure from ${url}`);
  }

  return items;
}
