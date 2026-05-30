import Parser from 'rss-parser';

export interface RSSItem {
    title?: string;
    link?: string;
    pubDate?: string;
    contentSnippet?: string;
}

export interface RSSFeedResponse {
    title?: string;
    link?: string;
    items: RSSItem[];
    readTime: number;
}

const estimateReadTime = (text: string): number => {
    const words = text.trim().split(/\s+/).length;
    const wpm = 200;
    return Math.ceil(words / wpm);
};

export const fetchFeed = async (url: string, signal: AbortSignal): Promise<RSSFeedResponse> => {
    try {
        const parser = new Parser();
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} ${response.statusText}`);
        }

        const remaining = response.headers.get('x-ratelimit-remaining');
        if (remaining !== null && Number(remaining) === 0) {
            throw new Error('Rate limit exceeded');
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);

        const items: RSSItem[] = feed.items.map((it) => ({
            title: it.title,
            link: it.link,
            pubDate: it.pubDate,
            contentSnippet: it.contentSnippet,
        }));

        const readTime = items.reduce((sum, item) => sum + estimateReadTime(item.contentSnippet || ''), 0);

        return {
            title: feed.title,
            link: feed.link,
            items,
            readTime,
        };
    } catch (err) {
        throw new Error(`Failed to fetch feed from ${url}: ${err instanceof Error ? err.message : String(err)}`);
    }
};