import FeedHeader from './components/feedHeader';
import FeedCard from './components/feedCard';
import Footer from './components/footer';

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <FeedHeader title="Example Feed" url="https://example.com/rss" />
      <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <FeedCard key={i} title={`Item ${i+1}`} description="Lorem ipsum dolor sit amet" />
        ))}
      </div>
      <Footer />
    </div>
  );
}