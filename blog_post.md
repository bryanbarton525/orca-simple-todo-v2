---
title: "Build a Tiny Vanilla JS To‑Do App in 30 Minutes Fast"
description: "Build a single‑page todo app with vanilla JS, HTML, and CSS. Persist tasks with localStorage, and manage adding, toggling, and deleting items—all in under an hour."
keywords: "todo app, vanilla JS, localStorage, single-page, HTML, CSS"
---

## Hook
Learning how to build a fully functional todo list using nothing but the core web technologies is a great way to sharpen your front‑end skills. In this article you’ll see how to add, complete, and delete tasks, keep them in the browser’s localStorage, and package everything into a clean, single‑file web page. By the end you’ll own a small but complete SPA that you can extend or embed anywhere.

## Why a Vanilla Demo?
Most tutorials today push frameworks like React or Vue. That’s valuable, but the learning curve can distract from core concepts such as the event loop, DOM manipulation, and state persistence. A vanilla demo forces you to tackle these concepts directly, giving you a stronger foundation before you layer abstractions on top. Plus, a pure HTML/JS solution works out‑of‑the‑box on any modern browser without build steps.

## Project Layout
```
index.html      ← HTML + embedded CSS + JavaScript
```
Because the app is tiny, we keep all code in a single file. In a real‑world project you’d split responsibilities, but for clarity we’ll expose the entire implementation inline.

## 1. The HTML Skeleton
The markup is deliberately minimal: a heading, a form to capture new items, and a list where todos will appear.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Todo Demo</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    #todo-form { margin-bottom: 1rem; }
    #todo-list li { display: flex; align-items: center; margin-bottom: 0.5rem; }
    .done { text-decoration: line-through; color: gray; }
    button { margin-left: 0.5rem; }
  </style>
</head>
<body>
  <h1>Vanilla Todo</h1>
  <form id="todo-form">
    <input type="text" id="new-todo" placeholder="What needs doing?" required />
    <button type="submit">Add</button>
  </form>
  <ul id="todo-list"></ul>
  <script src="app.js"></script>
</body>
</html>
```
Notice the empty `<ul>` that will receive list items. The `<script>` tag pulls in the JavaScript that drives the UI.

## 2. State Representation
We model each todo as:
```js
{ id: string, text: string, done: boolean }
```
The `id` is a short UUID generated with `crypto.randomUUID()`. Storing todos as an array in `localStorage` under the key `todos` keeps the persistence simple.

## 3. Loading and Rendering
On page load we read the stored array, defaulting to an empty list if nothing exists, then render each item.

```js
const STORAGE_KEY = 'todos';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const listEl = document.getElementById('todo-list');

function render() {
  listEl.innerHTML = '';
  todos.forEach(addTodoToDOM);
}

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => toggleDone(todo.id));

  const span = document.createElement('span');
  span.textContent = todo.text;
  if (todo.done) span.classList.add('done');

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✖';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  li.append(checkbox, span, deleteBtn);
  listEl.append(li);
}
```
The `render()` function clears the list and repopulates it every time the data changes. This naive but effective pattern keeps the UI in sync with state.

## 4. Adding a Todo
The form’s submit event is intercepted to create a new todo and persist it.

```js
const form = document.getElementById('todo-form');
const input = document.getElementById('new-todo');
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const newTodo = { id: crypto.randomUUID(), text, done: false };
  todos.push(newTodo);
  save();
  render();
  input.value = '';
});
```
The `save()` helper writes the current array back to `localStorage`.

## 5. Toggling and Deleting
Both operations modify the array, persist the change, and re‑render.

```js
function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
```
All mutation logic is contained in a handful of functions, making the code easy to audit and extend.

## 6. Running the Demo
Because everything lives in a single HTML file, you can run the app simply by opening `index.html` in a browser. No build step, no server, no package manager. If you want to view the console logs, open DevTools and watch the network tab stay empty.

```bash
# from the project directory
open index.html
```
For systems that prefer `xdg-open` or `start`, replace `open` accordingly.

## 7. Extending the App
A few natural next steps keep the codebase minimal yet functional:

* **Editing** a todo’s text by replacing the span with an input on double‑click.
* **Reordering** items with drag‑and‑drop and persisting the new order.
* **Filter UI** to show only pending or completed tasks.
* **Clear All** button to wipe localStorage.

Each enhancement follows the same pattern: read or mutate the `todos` array, call `save()`, and call `render()`.

## Conclusion
This article demonstrates that a fully featured todo list can be built with just three web standards: HTML for structure, CSS for styling, and JavaScript for interactivity and persistence. By avoiding frameworks you gain a deeper understanding of how the DOM, event loop, and storage APIs cooperate. The code is short, testable, and ready to be expanded into a learning project or a small production feature.

---
