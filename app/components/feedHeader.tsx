export default function FeedHeader({ title, url }: { title: string; url: string }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <a href={url} className="text-blue-500 underline mt-2 sm:mt-0">
        {url}
      </a>
    </header>
  );
}