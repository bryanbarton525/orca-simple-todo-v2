(function() {
  const STORAGE_KEY = 'todos';
  const form = document.getElementById('todo-form');
  const input = document.getElementById('new-todo');
  const list = document.getElementById('todo-list');

  function loadTodos() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function render() {
    const todos = loadTodos();
    list.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      if (todo.completed) li.classList.add('completed');

      const toggle = document.createElement('button');
      toggle.textContent = todo.completed ? 'Undo' : 'Done';
      toggle.onclick = () => {
        todo.completed = !todo.completed;
        saveTodos(todos);
        render();
      };

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.onclick = () => {
        todos.splice(index, 1);
        saveTodos(todos);
        render();
      };

      li.appendChild(toggle);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const todos = loadTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    input.value = '';
    render();
  });

  render();
})();