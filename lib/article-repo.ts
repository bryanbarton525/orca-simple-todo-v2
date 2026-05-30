import { PrismaClient, Article } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll(): Promise<Article[]> {
  try {
    return await prisma.article.findMany();
  } catch (err) {
    throw new Error(`Failed to fetch all articles: ${err}`);
  }
}

export async function getById(id: string): Promise<Article | null> {
  try {
    return await prisma.article.findUnique({ where: { id } });
  } catch (err) {
    throw new Error(`Failed to fetch article ${id}: ${err}`);
  }
}

export async function create(
  title: string,
  content: string,
  completed: boolean = false
): Promise<Article> {
  try {
    return await prisma.article.create({
      data: { title, content, completed }
    });
  } catch (err) {
    throw new Error(`Failed to create article: ${err}`);
  }
}

export async function paginate(
  page: number,
  pageSize: number
): Promise<{ data: Article[]; total: number; page: number; pageSize: number }> {
  const skip = (page - 1) * pageSize;
  try {
    const [data, total] = await Promise.all([
      prisma.article.findMany({ skip, take: pageSize }),
      prisma.article.count()
    ]);
    return { data, total, page, pageSize };
  } catch (err) {
    throw new Error(`Failed to paginate articles: ${err}`);
  }
}
