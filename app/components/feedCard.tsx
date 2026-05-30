export default function FeedCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="p-4 border rounded shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm mt-1">{description}</p>
    </article>
  );
}