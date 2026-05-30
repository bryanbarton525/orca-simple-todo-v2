import { Parser, Feed as RssFeed, Item as RssItem } from 'rss-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const parser = new Parser();

type FeedStatus = 'pending' | 'success' | 'error';
const feedStatusMap = new Map<string, FeedStatus>();

export async function ingestFeeds(feedUrls: string[]): Promise<void> {
  for (const url of feedUrls) {
    const feedId = url; // use url as identifier
    feedStatusMap.set(feedId, 'pending');
    try {
      const rss: RssFeed = await parser.parseURL(url);
      await prisma.feed.upsert({
        where: { url },
        update: { title: rss.title ?? '' },
        create: { url, title: rss.title ?? '' },
      });
      const entries: RssItem[] = rss.items ?? [];
      for (const item of entries) {
        const link = item.link ?? item.guid ?? '';
        if (!link) continue;
        await prisma.feedEntry.upsert({
          where: { link },
          update: {
            title: item.title ?? '',
            content: item.content ?? item.contentSnippet ?? '',
            published: item.pubDate ? new Date(item.pubDate) : undefined,
          },
          create: {
            link,
            title: item.title ?? '',
            content: item.content ?? item.contentSnippet ?? '',
            published: item.pubDate ? new Date(item.pubDate) : undefined,
          },
        });
      }
      feedStatusMap.set(feedId, 'success');
    } catch (e: any) {
      feedStatusMap.set(feedId, 'error');
      console.error(`Failed to ingest ${url}:`, e.message);
    }
  }
}

export function getFeedStatus(feedId: string): FeedStatus | undefined {
  return feedStatusMap.get(feedId);
}
