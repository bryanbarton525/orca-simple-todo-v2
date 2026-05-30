// Utility functions
const STORAGE_KEY = 'todos';
function loadTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
// State
let todos = loadTodos();
const filters = new Set(['Work', 'Personal']);
// DOM elements
const todoListEl = document.getElementById('todo-list');
const newTodoEl = document.getElementById('new-todo');
const newCategoryEl = document.getElementById('new-category');
const addBtnEl = document.getElementById('add-btn');
const filterEls = document.querySelectorAll('.filter');
// Render
function render() {
  todoListEl.innerHTML = '';
  const filtered = todos.filter(t => filters.has(t.category));
  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No todos in selected categories.';
    todoListEl.appendChild(empty);
    return;
  }
  filtered.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = t.completed ? 'completed' : '';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.addEventListener('change', () => {
      t.completed = checkbox.checked;
      saveTodos(todos);
      render();
    });
    const span = document.createElement('span');
    span.textContent = `${t.text} [${t.category}]`;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos(todos);
      render();
    });
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoListEl.appendChild(li);
  });
}
// Event handlers
addBtnEl.addEventListener('click', () => {
  const text = newTodoEl.value.trim();
  if (!text) return;
  const category = newCategoryEl.value;
  todos.push({ text, category, completed: false });
  saveTodos(todos);
  newTodoEl.value = '';
  render();
});
filterEls.forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.checked) filters.add(cb.value);
    else filters.delete(cb.value);
    render();
  });
});
// Initial render
render();