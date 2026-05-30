import React from 'react';

export default function NewsprintTemplate({ articleMarkdown }: { articleMarkdown: string }) {
  return (
    <article className="max-w-3xl mx-auto p-4">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">Newsprint</h1>
      </header>
      <div dangerouslySetInnerHTML={{ __html: articleMarkdown }} className="prose mb-4" />
      <footer className="text-sm text-gray-500">Author Bio</footer>
    </article>
  );
}