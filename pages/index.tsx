import { useState, useEffect } from 'react';
import '../styles/globals.css';

type Todo = { id: string; text: string; completed: boolean };

const STORAGE_KEY = 'todos';

const loadTodos = (): Todo[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) as Todo[] : [];
};

const saveTodos = (todos: Todo[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          className="flex-1 border border-gray-300 rounded px-2 py-1 mr-2"
          type="text"
          placeholder="New todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          className="bg-blue-500 text-white rounded px-4 py-1"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              className="text-red-500 ml-2"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
