# Todo List App

A tiny vanilla‑JavaScript todo application that runs entirely in the browser. It stores todos in `localStorage` so the list persists across page reloads.

## Features
- Add a todo by typing in the input box and pressing **Enter**.
- Mark a todo as completed by clicking the checkbox.
- Delete a todo by clicking the trash icon.
- Todos are persisted in `localStorage` so they survive page refreshes.

## Setup & Running

The project is a pure static site. No backend is required.

```bash
# Install dependencies (for optional build tooling)
npm install

# Start the development server
npm run dev
```

Open the address shown in the terminal (usually http://localhost:3000). If you prefer a simple preview, you can also open `index.html` directly in any browser.

## Development

- `src/index.html` – the main page.
- `src/style.css` – styles.
- `src/app.js` – the only JavaScript file.

The build script (`npm run build`) copies the static assets to the `dist/` folder and minifies the code. It also generates a small `service-worker.js` for offline support.

## Usage

1. Type a task and press **Enter**.
2. Click the checkbox to toggle completion.
3. Click the trash icon to remove.
4. Refresh the page – your list will still be there.

## Contributing

Feel free to fork, open issues, or submit pull requests. All contributions are welcome!