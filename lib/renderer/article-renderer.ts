export function renderArticle(html: string): string {
  const sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)[^<]*)*<\/script>/gi, '');
  return sanitized;
}
