(function() {
  const STORAGE_KEY = 'todos';
  const newTodoInput = document.getElementById('new-todo');
  const todoList = document.getElementById('todo-list');

  function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = todo.completed ? 'completed' : '';
      li.textContent = todo.text;
      li.onclick = () => toggleTodo(index);
      const delBtn = document.createElement('button');
      delBtn.textContent = '✕';
      delBtn.onclick = (e) => { e.stopPropagation(); deleteTodo(index); };
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  function toggleTodo(index) {
    const todos = loadTodos();
    todos[index].completed = !todos[index].completed;
    saveTodos(todos);
    renderTodos(todos);
  }

  function deleteTodo(index) {
    const todos = loadTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos(todos);
  }

  function addTodo(text) {
    if (!text.trim()) return;
    const todos = loadTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    renderTodos(todos);
  }

  newTodoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTodo(newTodoInput.value);
      newTodoInput.value = '';
    }
  });

  // init
  renderTodos(loadTodos());
})();