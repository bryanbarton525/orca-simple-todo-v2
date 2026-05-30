export interface FeedItem {
  title: string;
  content: string;
  url?: string;
}

export function transformArticle(feedItem: FeedItem): string {
  if (!feedItem.title) {
    throw new Error('FeedItem missing title');
  }
  if (!feedItem.content) {
    throw new Error('FeedItem missing content');
  }

  const escape = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const titleEsc = escape(feedItem.title);
  const contentEsc = escape(feedItem.content);

  return `<article>\n  <h1>${titleEsc}</h1>\n  <div>${contentEsc}</div>\n  ${feedItem.url ? `<footer><a href="${escape(feedItem.url)}">${escape(feedItem.url)}</a></footer>` : ''}\n</article>`;
}