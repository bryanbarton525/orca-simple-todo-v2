import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';

const prisma = new PrismaClient();
const parser = new Parser();

export interface ArticleInput {
  title: string;
  link: string;
  pubDate?: Date;
  content?: string;
}

export async function fetchAndStoreFeed(rssUrl: string): Promise<ArticleInput[]> {
  // Validate URL
  let url: URL;
  try {
    url = new URL(rssUrl);
  } catch {
    throw new Error('Invalid RSS URL');
  }

  let feed: Parser.Output;
  try {
    feed = await parser.parseURL(url.toString());
  } catch (err) {
    throw new Error(`Failed to fetch or parse RSS feed: ${err instanceof Error ? err.message : err}`);
  }

  const articles: ArticleInput[] = feed.items.map((item) => ({
    title: item.title ?? 'Untitled',
    link: item.link ?? '',
    pubDate: item.pubDate ? new Date(item.pubDate) : undefined,
    content: item.contentSnippet ?? item.content ?? '',
  }));

  // Store articles via Prisma
  try {
    await Promise.all(
      articles.map((article) =>
        prisma.article.upsert({
          where: { link: article.link },
          update: { title: article.title, pubDate: article.pubDate, content: article.content },
          create: { title: article.title, link: article.link, pubDate: article.pubDate, content: article.content },
        })
      )
    );
  } catch (err) {
    throw new Error(`Failed to persist articles: ${err instanceof Error ? err.message : err}`);
  }

  return articles;
}