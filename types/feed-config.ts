// types/feed-config.ts
// Example:
// {
//   "feeds": [
//     {
//       "title": "Example Feed",
//       "link": "https://example.com/feed.xml",
//       "published": "2023-01-01T00:00:00Z",
//       "description": "An example feed item",
//       "source": "example.com"
//     }
//   ],
//   "refreshIntervalMs": 300000
// }

export interface FeedItem {
  title: string;
  link: string;
  published: string; // ISO date string
  description: string;
  source: string;
}

export interface FeedConfig {
  feeds: FeedItem[];
  refreshIntervalMs: number;
}