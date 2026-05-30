import { DOMParser } from 'node:dom';

export interface RssMetadata {
  title: string;
  description: string;
  publishedDate: string;
}

export async function parseRSS(url: string): Promise<RssMetadata> {
  const response = await fetch(url, {
    headers: { 'Accept': 'application/rss+xml, application/xml' }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');

  const titleNode = doc.querySelector('channel > title');
  const descNode = doc.querySelector('channel > description');
  const pubDateNode = doc.querySelector('channel > pubDate');

  if (!titleNode || !descNode || !pubDateNode) {
    throw new Error('RSS feed missing required elements');
  }

  return {
    title: titleNode.textContent ?? '',
    description: descNode.textContent ?? '',
    publishedDate: pubDateNode.textContent ?? '',
  };
}