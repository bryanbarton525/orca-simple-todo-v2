# Todo App

This is a tiny single-page todo application built with plain HTML, CSS, and vanilla JavaScript. It stores todos in the browser’s `localStorage`, so they survive page reloads but are tied to the specific browser.

## How to Run

1. **Clone the repository** (or copy the files into a directory).
2. **Open the application**
   * There is no build step or server required.
   * Simply double‑click `index.html` or serve it with a lightweight HTTP server, e.g. `python -m http.server`.
   * The app will load in the browser and you can start adding todos.

## Features

* **Add** a todo by typing into the input box and clicking **Add**.
* **Mark complete** by clicking the todo text; it will be crossed out.
* **Delete** a todo by clicking the **Delete** button next to it.

All state is stored in `localStorage` under the key `todos`.

## Project Structure

```
├─ index.html          # Main HTML page
├─ style.css           # Minimal styling
├─ script.js           # Application logic
├─ package.json        # npm metadata with a dummy test script
└─ README.md           # This documentation
```

## Testing

Running `npm test` will simply print a message because this is a front‑end only project.

```sh
npm test
# → No tests to run
```

Feel free to add your own unit tests or expand the feature set! The project is intentionally lightweight to demonstrate basic front‑end persistence.

---

Happy coding!