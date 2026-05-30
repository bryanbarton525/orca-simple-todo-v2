const STORAGE_KEY = 'todos';

const loadTodos = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) throw new Error('Invalid data');
    return parsed;
  } catch (e) {
    console.error('Failed to load todos', e);
    return [];
  }
};

const saveTodos = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos', e);
  }
};

const addTodo = (text) => {
  const todos = loadTodos();
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
};

const toggleTodo = (id) => {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos(todos);
};

const deleteTodo = (id) => {
  let todos = loadTodos();
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  const render = () => {
    const todos = loadTodos();
    list.innerHTML = '';
    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      li.dataset.id = todo.id;
      li.classList.toggle('completed', todo.completed);
      li.addEventListener('click', () => {
        toggleTodo(todo.id);
        render();
      });
      const delBtn = document.createElement('button');
      delBtn.textContent = 'x';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
        render();
      });
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    render();
  });

  render();
});

export { loadTodos, saveTodos, addTodo, toggleTodo, deleteTodo };
