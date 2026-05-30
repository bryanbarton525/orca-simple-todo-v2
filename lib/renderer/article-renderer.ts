export interface ArticleDraft {
    title: string;
    content: string;
    citations?: Record<string, string>;
}

export interface RenderedArticle {
    title: string;
    html: string;
}

function escapeHtml(str: string): string {
    return str.replace(/[&<>\