export interface Article {
  title: string;
  summary: string;
  link: string;
  publishDate: string;
  author: string;
}

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="border rounded-md overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 flex flex-col h-full"
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {article.title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-1">
          {article.summary}
        </p>
        <footer className="text-xs text-gray-500 dark:text-gray-400">
          <span>{article.author}</span>
          {' • '}
          <time dateTime={article.publishDate}>
            {new Date(article.publishDate).toLocaleDateString()}
          </time>
        </footer>
      </a>
    </article>
  );
}
