import { prisma } from "../../prisma/client";

export interface ArticleDraft {
  id?: string;
  title: string;
  content: string;
  tenantId: string;
}

export interface IndexedVector {
  id: string;
  tenantId: string;
  vector: number[];
}

/**
 * Calls an embedding service (MCP or external) to obtain a vector for the given text.
 * The service is expected to respond with JSON { embedding: number[] }.
 */
async function embedText(text: string, model: string): Promise<number[]> {
  const response = await fetch(`https://api.embedding.local/v1/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Model-Name": model,
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(`Embedding service returned ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data.embedding)) {
    throw new Error("Invalid embedding response format");
  }
  return data.embedding;
}

/**
 * Computes cosine similarity between two numeric vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Indexes an article by embedding its content and storing the vector in the database.
 * Returns the stored IndexedVector.
 */
export async function indexArticle(
  article: ArticleDraft,
  embeddingModel: string
): Promise<IndexedVector> {
  const vector = await embedText(article.content, embeddingModel);
  const indexed = await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      tenantId: article.tenantId,
      vector: vector,
    },
    select: {
      id: true,
      tenantId: true,
      vector: true,
    },
  });
  return {
    id: indexed.id,
    tenantId: indexed.tenantId,
    vector: indexed.vector,
  };
}

/**
 * Finds the top‑k most similar articles for a query string within a tenant.
 */
export async function findSimilar(
  query: string,
  tenantId: string,
  k: number = 5
): Promise<IndexedVector[]> {
  const queryVector = await embedText(query, "default");
  const all = await prisma.article.findMany({
    where: { tenantId },
    select: { id: true, tenantId: true, vector: true },
  });
  const scored = all.map((a) => ({
    vector: a,
    score: cosineSimilarity(queryVector, a.vector),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.vector);
}