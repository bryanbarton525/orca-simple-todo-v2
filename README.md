# Simple Todo App

A lightweight single‑page to‑do list built with plain HTML, CSS, and vanilla JavaScript. The app lets you add tasks, toggle them as complete, and delete them. All data is stored in the browser’s `localStorage`, so your list survives page reloads and browser restarts.

## Installation

```bash
git clone https://github.com/your-username/simple-todo-app.git
cd simple-todo-app
# Serve the static files
npx serve .
```

You can also just open `index.html` directly in a browser – no server needed.

## Features

- **Add** a new to‑do by typing in the input and pressing the Add button.
- **Delete** any item with its Delete icon.
- **Toggle** completion status by clicking the checkbox; completed items are struck through.
- **Persistence** via `localStorage` – the list is restored automatically on each load.

## Usage

1. Type a task into the input field at the top.
2. Click the **Add** button or press **Enter** to add it.
3. Click the checkbox to mark a task as done, or click the **Delete** icon to remove it.
4. Reload the page – your list remains intact.

## Technical Details

The entire app runs in the browser; it uses only standard web APIs (`document`, `localStorage`, event listeners) and contains no external dependencies. All logic lives in a single `app.js` file, while the visual styling is in `style.css`.

## License

This project is licensed under the MIT License.
