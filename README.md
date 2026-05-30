# Todo App Backend

This repository contains a minimal Todo application backend written in TypeScript using Prisma for data persistence. The project provides a simple article (Todo) repository with CRUD and pagination functionality.

## Prerequisites

- Node.js 20+ (or any recent LTS version)
- pnpm (preferred) or npm

## Setup

```bash
# Install dependencies
pnpm install
# Build the TypeScript sources
pnpm run build
```

> The `pnpm install` step will generate a lockfile that matches the declared dependencies. The `.npmrc` file ensures the lockfile is not validated as frozen, preventing CI‑style lockfile mismatch errors.

## Running the Application

The current code is a library module. You can integrate it into any Node.js application. For example, a simple Express server could use the repository like this:

```ts
import express from 'express';
import { getAll } from './lib/article-repo';

const app = express();
app.get('/todos', async (req, res) => {
  const todos = await getAll();
  res.json(todos);
});
app.listen(3000, () => console.log('Server listening on 3000'));
```

## Testing

The project includes a minimal `test` script that simply prints a message. Add real tests under `__tests__` or `test/` directories and update the script accordingly.

```bash
pnpm run test
```

## Building for Production

Running `pnpm run build` compiles the TypeScript code into the `dist/` directory. The generated files can be executed with Node:

```bash
node dist/index.js
```

---

Feel free to extend the repository with additional features, such as authentication or advanced querying, while keeping the same pattern of error handling and Prisma usage.
