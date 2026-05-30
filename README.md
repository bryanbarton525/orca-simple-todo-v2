# rss-newspaper

rss-newspaper is a lightweight Next.js application that lets you aggregate and view RSS feeds in a clean, mobile‑friendly layout. All data is stored in the browser’s localStorage, so the app works offline and without any backend.

## Quick start

```bash
npx create-next-app@latest rss-newspaper --typescript --tailwind
cd rss-newspaper
# replace the default pages with the rss‑newspaper code (copy the source into this repo)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you’ll see the home page.

## Features

- **Add RSS feeds** – submit an RSS URL on the `/feed` page.
- **View styled articles** – each feed’s latest items are rendered with Tailwind CSS.
- **Delete feeds** – remove a feed from the list and all its items are removed from localStorage.
- **Local persistence** – feeds and cached items survive page reloads and work offline.

## Adding feeds

1. Navigate to `/feed` or click the **Add feed** button.
2. Paste the RSS URL and click **Save**.
3. The feed appears on the home page and its items are fetched on load.

## API reference

| Method | Path | Description |
|--------|------|-------------|
| **GET** | `/api/feeds` | Returns the list of all subscribed feeds. |
| **POST** | `/api/feeds` | Body: `{ url: string }`. Adds a new feed. |
| **DELETE** | `/api/feeds?name=<name>` | Removes the feed identified by `name`. |

The API is purely in‑memory and is served by Next.js API routes; it is not intended for production use.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **CORS error** | The app runs on the same origin as the API; if you’re proxying it, make sure the proxy forwards the `Origin` header. |
| **Feed fetch fails** | Verify the RSS URL is reachable and returns XML. Some providers require HTTPS or a user‑agent header. |
| **LocalStorage limit exceeded** | Clearing the browser’s site data or switching to a different browser will reset the stored feeds. |

## Further reading

- [Next.js documentation](https://nextjs.org/docs) – learn about pages, API routes, and static generation.
- [RSS specification](https://validator.w3.org/feed/docs/rss2.html) – understand the XML format expected by the app.

Happy reading! 🎉