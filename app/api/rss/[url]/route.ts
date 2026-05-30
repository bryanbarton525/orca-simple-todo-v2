import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { url: string } }
) {
  const decoded = decodeURIComponent(params.url);
  let targetUrl: URL;
  try {
    targetUrl = new URL(decoded);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  let fetchResponse: Response;
  try {
    fetchResponse = await fetch(targetUrl.toString());
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }

  if (!fetchResponse.ok) {
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }

  const xmlText = await fetchResponse.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    pubDate: item.querySelector('pubDate')?.textContent ?? '',
    author: item.querySelector('author')?.textContent ?? ''
  }));

  return NextResponse.json(items);
}
