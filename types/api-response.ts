// types/api-response.ts
import { FeedItem } from './feed-config';

export type RSSFeedResponse = {
  status: string;
  data: {
    items: FeedItem[];
  };
};