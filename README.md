# RSS Feed API

This repository contains a minimal Next.js API route that fetches and parses RSS feeds.

## Setup

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The API is available at:

```
GET /api/rss/[url]
```

Replace `[url]` with a URL-encoded RSS feed URL, for example:

```
GET /api/rss/https%3A%2F%2Fexample.com%2Frss.xml
```
