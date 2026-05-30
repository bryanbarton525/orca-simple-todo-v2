# Minimal Todo App

A tiny single‑page application built with plain HTML, CSS and vanilla JavaScript. It allows you to add, complete, and delete todo items, and stores them in the browser’s `localStorage` so they persist across page reloads.

---

## Features
- **Add** a todo with a text input.
- **Mark** a todo as completed by clicking the checkbox.
- **Delete** a todo with the trash icon.
- **Persist** todos in `localStorage` (no server needed).
- Fully responsive UI.

---

## Project Structure
```
├── index.html        # Main page
├── styles.css        # Styling
├── app.js            # Application logic
└── README.md         # Documentation (you are reading it!)
```

---

## Local Development
The project uses `npm` scripts for convenience, but no build step is required.

1. **Install dependencies** (if you plan to use a task runner like `npm run dev`).
   ```bash
   npm install
   ```
2. **Run development server**.
   ```bash
   npm run dev
   ```
   This starts a lightweight static server that automatically reloads when files change.
3. **Build for production**.
   ```bash
   npm run build
   ```
   The `build` script simply copies the files to a `dist` folder; you can host that folder with any static host.

> **Note:** If you prefer a minimal setup without `npm`, you can open `index.html` directly in a browser.

---

## Usage
1. Open the app in your browser.
2. Type a task into the input box and press **Enter** or click **Add**.
3. Click the checkbox next to a task to mark it completed.
4. Click the trash icon to delete a task.
5. All changes are saved automatically in `localStorage`.

---

## Contribution Guidelines
1. Fork the repository and create a feature branch.
2. Write tests for new functionality.
3. Ensure all existing tests pass: `npm test`.
4. Open a pull request.

---

## License
MIT © 2026
