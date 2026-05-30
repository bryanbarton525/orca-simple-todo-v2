import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <div className="w-full max-w-md">
        <TodoList />
      </div>
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, input.trim()]);
    setInput('');
  };

  const toggleTodo = (index: number) => {
    setTodos(todos.map((t, i) => (i === index ? `${t} ✅` : t)));
  };

  const deleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="New todo"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-1 rounded">
          Add
        </button>
      </div>
      <ul>
        {todos.map((t, i) => (
          <li key={i} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={t.endsWith('✅')}
              onChange={() => toggleTodo(i)}
            />
            <span className={t.endsWith('✅') ? 'line-through' : ''}>{t.replace(' ✅', '')}</span>
            <button onClick={() => deleteTodo(i)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}