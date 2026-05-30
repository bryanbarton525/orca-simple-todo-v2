import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  source: string
  timestamp: string
  read: boolean
  closed: boolean
}

const sampleArticles: Article[] = [
  { id: '1', title: 'Breaking News', source: 'Reuters', timestamp: '2026-05-30T10:00:00Z', read: false, closed: false },
  { id: '2', title: 'Tech Update', source: 'TechCrunch', timestamp: '2026-05-29T08:30:00Z', read: true, closed: false },
  { id: '3', title: 'Sports', source: 'ESPN', timestamp: '2026-05-28T14:15:00Z', read: false, closed: true },
]

export default function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filter, setFilter] = useState<'all' | 'unread' | 'closed'>('all')
  const [articles, setArticles] = useState<Article[]>(sampleArticles)

  // Load theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
    }
  }, [])

  // Persist theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  const filtered = articles.filter(a => {
    if (filter === 'all') return true
    if (filter === 'unread') return !a.read
    return a.closed
  })

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} style={{ minHeight: '100vh' }}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl">Newspaper Reader</h1>
        <button onClick={toggleTheme} className="p-2 rounded border">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <section className="p-4">
        <label htmlFor="filter" className="mr-2">Filter:</label>
        <select id="filter" value={filter} onChange={e => setFilter(e.target.value as any)} className="p-1 border rounded">
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="closed">Closed</option>
        </select>
      </section>
      <section className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(article => (
          <div key={article.id} className="border rounded p-3">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">{article.source}</p>
            <p className="text-xs text-gray-400">{new Date(article.timestamp).toLocaleString()}</p>
            <Link href={`/articles/${article.id}`}>Read more</Link>
          </div>
        ))}
      </section>
    </div>
  )
}
