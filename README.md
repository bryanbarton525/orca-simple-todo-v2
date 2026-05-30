# Todo App

A minimal single‑page application that lets you add, mark complete, and delete todo items. It uses vanilla JavaScript, plain HTML and CSS, and persists data in the browser’s `localStorage`.

## Features

- **Add a todo** – type text and press *Enter* or click *Add*.
- **Mark complete** – click the checkbox to toggle completion.
- **Delete** – press the trash icon to remove a todo.
- **Persisted state** – all todos are stored in `localStorage`, so they survive page reloads.
- **Responsive layout** – works on desktop and mobile.

## Setup

```bash
# Clone the repo
git clone https://github.com/your-username/todo-app.git
cd todo-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default port).

### Build

```bash
npm run build
```

A production build is created in the `dist/` folder.

## Screenshots

![Todo App Screenshot](./screenshot.png)

*The app shows a clean, minimal interface. Add, complete, and delete actions are demonstrated.*

## LocalStorage usage

The application stores the todo list as a JSON string under the key `todos`. On load it reads the key and renders the items; on any change it writes back the updated list.

## RSS Feed

This project does **not** expose an RSS feed. The placeholder in the original request can be removed.

## Contribution Guidelines

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Commit with clear, descriptive messages.
4. Open a pull request; ensure the CI passes (`npm test`).

Please keep the commit history clean and add tests for new features.

## License

MIT © Your Name