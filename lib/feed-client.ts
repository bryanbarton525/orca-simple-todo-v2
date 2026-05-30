export interface Feed {
	title: string;
	link: string;
	description?: string;
	articles: Article[];
}

export interface Article {
	title: string;
	link: string;
	pubDate?: string;
	description?: string;
}

const cache = new Map<string, { data: Feed; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchFeed(apiUrl: string): Promise<Feed> {
	const now = Date.now();
	const cached = cache.get(apiUrl);
	if (cached && cached.expires > now) {
		return cached.data;
	}
	const response = await fetch(apiUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
	}
	const xmlText = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlText, "application/xml");

	const channel = doc.querySelector("channel");
	if (!channel) {
		throw new Error("Invalid RSS feed: missing channel element");
	}

	const title = channel.querySelector("title")?.textContent || "";
	const link = channel.querySelector("link")?.textContent || "";
	const description = channel.querySelector("description")?.textContent;

	const items = Array.from(doc.querySelectorAll("item")).map((item) => ({
		title: item.querySelector("title")?.textContent || "",
		link: item.querySelector("link")?.textContent || "",
		pubDate: item.querySelector("pubDate")?.textContent,
		description: item.querySelector("description")?.textContent,
	}));

	const feed: Feed = {
		title,
		link,
		description,
		articles: items,
	};

	cache.set(apiUrl, { data: feed, expires: now + CACHE_TTL_MS });
	return feed;
}
