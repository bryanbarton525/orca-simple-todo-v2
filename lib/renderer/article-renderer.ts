export interface Article {
  title: string;
  author?: string;
  date?: string;
  content: string;
}

export const ArticleRenderer = ({ title, author, date, content }: Article) => {
  return (
    <article className="prose dark:prose-invert mx-auto">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {(author || date) && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {author && <span>By {author} </span>}
          {date && <time>{date}</time>}
        </p>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};