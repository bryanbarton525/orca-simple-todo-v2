export default function Page() {
  const articles = [
    {title: 'First Article', source: 'Example.com', date: '2026-05-30', excerpt: 'An exciting first article.'},
    {title: 'Second Article', source: 'Example.com', date: '2026-05-29', excerpt: 'A follow-up to the first.'},
    {title: 'Third Article', source: 'Example.com', date: '2026-05-28', excerpt: 'Insights on a new topic.'},
    {title: 'Fourth Article', source: 'Example.com', date: '2026-05-27', excerpt: 'A deep dive into details.'},
    {title: 'Fifth Article', source: 'Example.com', date: '2026-05-26', excerpt: 'Wrapping up the series.'},
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-4">Todo App</h1>
      <div className="hero mb-8">
        <form className="flex mb-4">
          <input className="flex-1 p-2 rounded-l bg-gray-700 text-white" type="text" placeholder="Add todo" />
          <button className="p-2 rounded-r bg-blue-600" type="submit">Add</button>
        </form>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {articles.map((a, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl">{a.title}</h2>
            <p className="text-sm text-gray-400">{a.source} • {a.date}</p>
            <p className="mt-2">{a.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}