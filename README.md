## Overview
A lightweight web application that transforms any RSS feed into a clean, newspaper‑style article layout. It fetches the XML, parses the items, converts each into Markdown, and displays them in a responsive page. The goal is to give readers a distraction‑free reading experience without relying on external readers.

## Features
- Fetch and parse RSS feeds with Axios.
- Convert feed items to Markdown using a tiny helper.
- Persist the list in `localStorage` so visits are stateful.
- Mark items as read, completed or delete them with local state updates.
- Responsive, newspaper‑style CSS that mimics a printed page.

## Tech Stack
- **Next.js** for the server‑rendered SPA.
- **TypeScript** for type safety.
- **React** for the UI.
- **Axios** for HTTP requests.
- Plain **HTML/CSS** for the final styling.

## Usage
1. Clone the repo and run `npm install` followed by `npm run dev`.
2. In the browser open <http://localhost:3000>.
3. Enter any RSS feed URL, e.g.:

```text
https://news.un.org/feed/1.0/eng/rss.xml
```
4. The page will show a list of articles. Clicking an item toggles its read state; clicking the trash icon deletes it. The state persists across page reloads.
5. Example of the generated Markdown for a single item:

```markdown
# World News – UN
**Source:** https://news.un.org

*Published on:* 2026-05-30

## Article Title
Content of the article in markdown format.

> *Read more at:* https://news.un.org/en/story/123456
```
Press the **Reload** button to refresh the feed or edit the URL to fetch another source.