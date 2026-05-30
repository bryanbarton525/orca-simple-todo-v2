import React from 'react';

export interface ArticlePreviewProps {
  title: string;
  source: string;
  publishedAt: string;
  excerpt: string;
  rssUrl: string;
  onSubscribe: (url: string) => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  title,
  source,
  publishedAt,
  excerpt,
  rssUrl,
  onSubscribe,
}) => {
  const articleId = `article-${rssUrl}`;
  return (
    <div
      className="border rounded p-4 shadow-sm bg-white"
      role="article"
      aria-labelledby={articleId}
    >
      <h2 id={articleId} className="text-xl font-semibold">
        {title}
      </h2>
      <p className="text-sm text-gray-600">
        {source} • {publishedAt}
      </p>
      <p className="mt-2">{excerpt}</p>
      <button
        onClick={() => onSubscribe(rssUrl)}
        className="mt-4 inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Subscribe to ${title} RSS feed`}
      >
        Subscribe
      </button>
    </div>
  );
};

export default ArticlePreview;