import rssParser from 'rss-parser';

export const POST = async (request: Request) => {
  const { feedUrl, apiKey } = await request.json();

  if (!feedUrl) {
    return Response.json({ error: 'feedUrl is required' }, { status: 400 });
  }

  const parser = new rssParser.Parser({
    headers: {
      'User-Agent': 'RSS-TodoApp/1.0',
      Accept: 'application/rss+xml, application/xml',
    },
  });

  try {
    const feed = await parser.parseURL(feedUrl);

    if (!feed || !feed.items) {
      throw new Error('Invalid RSS feed');
    }

    const items = feed.items.map((item) => ({
      title: item.title ?? '',
      description: item.contentSnippet ?? '',
      pubDate: item.pubDate ?? '',
      link: item.link ?? '',
      enclosure: item.enclosure?.url ?? '',
    }));

    return Response.json({ items });
  } catch (err: any) {
    if (err.statusCode === 429) {
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return Response.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
};