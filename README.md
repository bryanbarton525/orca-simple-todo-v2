# RSS Newspaper

## How to run locally

1. Ensure Node.js (v18+) is installed.
2. Navigate to the project root.
3. Run `npm run build` to satisfy the build script.
4. Serve the `index.html` file with any static file server, e.g. `npx serve .` or `python -m http.server`.
5. Open `http://localhost:5000` (or the port shown by your server) in a browser.

The app uses `localStorage` to persist todos and does not require a backend. Enjoy!