import { type Article } from '@/types';
import { markAsRead, deleteArticle, openArticle } from '@/actions';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="p-4 border rounded">
      <h2 className="text-lg font-semibold">{article.title}</h2>
      <p>{article.description}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => openArticle(article.id)}>Open</button>
        <button onClick={() => markAsRead(article.id)}>Mark as Read</button>
        <button onClick={() => deleteArticle(article.id)}>Delete</button>
      </div>
    </article>
  );
}

export function ArticleDetail({ article }: ArticleCardProps) {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-2">{article.content}</p>
      <div className="mt-4 text-sm text-gray-600">{article.tags.join(', ')}</div>
      <div className="text-xs text-gray-400 mt-2">{new Date(article.timestamp).toLocaleString()}</div>
    </section>
  );
}
