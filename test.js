import { strict as assert } from 'assert';
import { transformArticle } from './src/services/article-transformer.service';

// Simple FeedItem
const feedItem = { title: 'Hello <World>', content: 'This is a <b>bold</b> move & a "quote".' };

const result = transformArticle(feedItem);
assert(result.includes('&lt;World&gt;'), 'Title should be escaped');
assert(result.includes('This is a &lt;b&gt;bold&lt;/b&gt; move &amp; a &quot;quote&quot;.'), 'Content should be escaped');
console.log('All tests passed');
