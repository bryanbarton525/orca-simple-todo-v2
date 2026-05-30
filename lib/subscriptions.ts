// lib/subscriptions.ts
// A simple client‑side subscription service.
// It stores URLs in localStorage under the key "subscriptions"
// and mock article objects in "articles". Articles are
// generated asynchronously after a small delay.

const SUBSCRIPTION_KEY = "subscriptions";
const ARTICLES_KEY = "articles";

/**
 * Represents a mock article returned from an RSS feed.
 */
export interface Article {
  url: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO string
}

/**
 * SubscriptionService provides an in‑browser subscription API.
 * It persists data to localStorage and exposes async helpers.
 */
export default class SubscriptionService {
  private subscriptions: string[];
  private articles: Article[];

  constructor() {
    this.subscriptions = this.loadList(SUBSCRIPTION_KEY);
    this.articles = this.loadList(ARTICLES_KEY);
  }

  /** Load a JSON array from localStorage, defaulting to [] */
  private loadList<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  /** Persist a JSON array to localStorage */
  private saveList<T>(key: string, list: T[]) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  /** Get the current list of subscription URLs */
  getSubscriptions(): string[] {
    return [...this.subscriptions];
  }

  /** Get all stored articles */
  getArticles(): Article[] {
    return [...this.articles];
  }

  /** Add a new RSS URL and return a mock article after a delay */
  async addSubscription(url: string): Promise<Article> {
    if (this.subscriptions.includes(url)) {
      throw new Error("Subscription already exists");
    }
    this.subscriptions.push(url);
    this.saveList(SUBSCRIPTION_KEY, this.subscriptions);

    const article = this.mockArticle(url);
    // Simulate async fetch delay
    await new Promise(resolve => setTimeout(resolve, 500));
    this.articles.push(article);
    this.saveList(ARTICLES_KEY, this.articles);
    return article;
  }

  /** Delete a subscription by URL */
  deleteSubscription(url: string): void {
    this.subscriptions = this.subscriptions.filter(u => u !== url);
    this.saveList(SUBSCRIPTION_KEY, this.subscriptions);
    this.articles = this.articles.filter(a => a.url !== url);
    this.saveList(ARTICLES_KEY, this.articles);
  }

  /** Generate a deterministic mock article for a given URL */
  private mockArticle(url: string): Article {
    const now = new Date();
    return {
      url,
      title: `Mock article for ${url}`,
      summary: `This is a mock summary for ${url}.`,
      publishedAt: now.toISOString(),
    };
  }
}
