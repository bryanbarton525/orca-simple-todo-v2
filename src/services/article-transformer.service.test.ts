import { transformArticle, FeedItem } from './article-transformer.service';

const feedItem: FeedItem = {
  title: 'Test <Title>',
  content: 'Some & content',
  url: 'https://example.com'
};

const html = transformArticle(feedItem);
if (!html.includes('&lt;Title&gt;')) throw new Error('Title not escaped');
if (!html.includes('Some &amp; content')) throw new Error('Content not escaped');
console.log('All tests passed');