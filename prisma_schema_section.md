## Prisma Schema for Feed and Article

The application models a simple content publishing domain with two primary entities: **Feed** and **Article**. A Feed represents a source or category of content (e.g., a blog, news outlet, or RSS feed), while an Article corresponds to an individual piece of content published under a Feed. Each Feed has a unique identifier, a human‑readable title, a URL, and timestamps for creation and last update. Articles belong to exactly one Feed via a foreign key, carry a title, body, author, and publication timestamp, and are indexed by a surrogate `id`. Prisma’s declarative schema allows you to express these relationships with `@relation` fields and cascade delete behavior so that removing a Feed automatically purges its Articles. Below is a skeletal Prisma schema that captures this structure.

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-go"
}

model Feed {
  id          String   @id @default(uuid())
  title       String
  url         String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  articles    Article[] @relation("FeedArticles", onDelete: Cascade)
}

model Article {
  id          String   @id @default(uuid())
  title       String
  body        String
  author      String
  publishedAt DateTime
  feedId      String
  feed        Feed     @relation("FeedArticles", fields: [feedId], references: [id])
}
```