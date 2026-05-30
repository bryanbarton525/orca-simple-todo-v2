const todoList = document.getElementById('todo-list');
const newTodoInput = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');

function loadTodos() {
  const stored = localStorage.getItem('todos');
  if (!stored) return;
  const todos = JSON.parse(stored);
  todos.forEach(addTodoToDOM);
}

function saveTodos() {
  const todos = Array.from(todoList.children).map(li => ({
    text: li.querySelector('span').textContent,
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodoToDOM(todo) {
  const li = document.createElement('li');
  if (todo?.completed) li.classList.add('completed');
  const span = document.createElement('span');
  span.textContent = todo?.text ?? '';
  const btn = document.createElement('button');
  btn.textContent = todo?.completed ? 'Undo' : 'Done';
  btn.onclick = () => {
    li.classList.toggle('completed');
    btn.textContent = li.classList.contains('completed') ? 'Undo' : 'Done';
    saveTodos();
  };
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.onclick = () => {
    li.remove();
    saveTodos();
  };
  li.append(span, btn, delBtn);
  todoList.appendChild(li);
}

addBtn.onclick = () => {
  const text = newTodoInput.value.trim();
  if (!text) return;
  addTodoToDOM({text});
  newTodoInput.value = '';
  saveTodos();
};

loadTodos();
