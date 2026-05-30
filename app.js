const STORAGE_KEY = 'todos';

function loadTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  const todos = loadTodos();
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.style.cursor = 'pointer';
    span.onclick = () => toggle(idx);
    const del = document.createElement('button');
    del.textContent = '✕';
    del.onclick = () => deleteTodo(idx);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function addTodo(text) {
  const todos = loadTodos();
  todos.push({ text, completed: false });
  saveTodos(todos);
  render();
}

function toggle(idx) {
  const todos = loadTodos();
  todos[idx].completed = !todos[idx].completed;
  saveTodos(todos);
  render();
}

function deleteTodo(idx) {
  const todos = loadTodos();
  todos.splice(idx, 1);
  saveTodos(todos);
  render();
}

document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('newTodo');
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
  }
});

render();