"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionError = exports.FeedNotFoundError = void 0;
exports.ingestFeed = ingestFeed;
const client_1 = require("@prisma/client");
const rss_parser_1 = __importDefault(require("rss-parser"));
class FeedNotFoundError extends Error {
    constructor(url) {
        super(`Feed not found: ${url}`);
        this.name = 'FeedNotFoundError';
    }
}
exports.FeedNotFoundError = FeedNotFoundError;
class IngestionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IngestionError';
    }
}
exports.IngestionError = IngestionError;
async function ingestFeed(url, tenantId, signal) {
    const parser = new rss_parser_1.default();
    try {
        const feed = await parser.parseURL(url, { requestOptions: { signal } });
        if (!feed.items || feed.items.length === 0) {
            throw new FeedNotFoundError(url);
        }
        const prisma = new client_1.PrismaClient();
        const results = await Promise.all(feed.items.map(async (item) => {
            const title = item.title || '';
            const link = item.link || '';
            const description = item.contentSnippet || '';
            const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            return prisma.article.upsert({
                where: { link },
                update: { title, description, pubDate, tenantId },
                create: { title, link, description, pubDate, tenantId },
            });
        }));
        await prisma.disconnect();
        return { url, tenantId, totalItems: results.length, success: true, errors: [] };
    }
    catch (err) {
        if (err instanceof Error && err.name === 'AbortError')
            throw err;
        throw new IngestionError(`Failed to ingest ${url}: ${err instanceof Error ? err.message : String(err)}`);
    }
}
