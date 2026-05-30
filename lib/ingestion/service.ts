import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

export class FeedNotFoundError extends Error {
  constructor(url: string) {
    super(`Feed not found: ${url}`);
    this.name = 'FeedNotFoundError';
  }
}

export class IngestionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IngestionError';
  }
}

export interface IngestionLog {
  url: string;
  tenantId: string;
  totalItems: number;
  success: boolean;
  errors: string[];
}

export async function ingestFeed(url: string, tenantId: string, signal?: AbortSignal): Promise<IngestionLog> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL(url, { requestOptions: { signal } });
    if (!feed.items || feed.items.length === 0) {
      throw new FeedNotFoundError(url);
    }
    const prisma = new PrismaClient();
    const results = await Promise.all(feed.items.map(async (item) => {
      const title = item.title || '';
      const link = item.link || '';
      const description = item.contentSnippet || '';
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      return prisma.article.upsert({
        where: { link },
        update: { title, description, pubDate, tenantId },
        create: { title, link, description, pubDate, tenantId },
      });
    }));
    await prisma.disconnect();
    return { url, tenantId, totalItems: results.length, success: true, errors: [] };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new IngestionError(`Failed to ingest ${url}: ${err instanceof Error ? err.message : String(err)}`);
  }
}
