import React from "react";
import { formatDistanceToNow } from "date-fns";

interface FeedCardProps {
  title: string;
  published: string; // ISO string
  summary: string;
  readTime: string; // e.g., "5 min read"
  sourceLink: string;
}

const truncate = (text: string, max: number) => {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
};

const FeedCard: React.FC<FeedCardProps> = ({ title, published, summary, readTime, sourceLink }) => {
  const relativeTime = formatDistanceToNow(new Date(published), { addSuffix: true });

  return (
    <article className="bg-white rounded shadow p-4 hover:shadow-lg transition shadow-none focus-within:shadow-lg" aria-labelledby="feed-title-" role="article">
      <h2 id="feed-title-" className="text-xl font-semibold mb-1 truncate" title={title}>
        {truncate(title, 50)}
      </h2>
      <p className="text-sm text-gray-600 mb-2" aria-label={relativeTime}>{relativeTime}</p>
      <p className="text-gray-800 mb-3 line-clamp-3" title={summary}>{summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{readTime}</span>
        <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" aria-label="Open source">Source</a>
      </div>
    </article>
  );
};

export default FeedCard;
