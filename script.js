const storageKey = 'todos';
const todoListEl = document.getElementById('todo-list');
const newTodoEl = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');

function loadTodos() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : [];
}

function saveTodos(todos) {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

function renderTodos() {
  const todos = loadTodos();
  todoListEl.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.dataset.id = idx;
    if (todo.completed) li.classList.add('completed');
    li.addEventListener('click', () => toggleComplete(idx));
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTodo(idx);
    });
    li.appendChild(delBtn);
    todoListEl.appendChild(li);
  });
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ text, completed: false });
  saveTodos(todos);
  renderTodos();
}

function toggleComplete(idx) {
  const todos = loadTodos();
  todos[idx].completed = !todos[idx].completed;
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(idx) {
  let todos = loadTodos();
  todos.splice(idx, 1);
  saveTodos(todos);
  renderTodos();
}

addBtn.addEventListener('click', () => {
  const text = newTodoEl.value.trim();
  if (text) {
    addTodo(text);
    newTodoEl.value = '';
  }
});

document.addEventListener('DOMContentLoaded', renderTodos);