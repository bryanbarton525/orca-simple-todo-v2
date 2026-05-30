import { useState, useEffect } from 'react';

export default function Page() {
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value.trim();
    if (!text) return;
    setTodos([...todos, { text, completed: false }]);
    e.target.reset();
  };

  const toggle = (index) => {
    const updated = todos.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t));
    setTodos(updated);
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Todo List</h1>
      <form onSubmit={addTodo} style={{ marginBottom: 20 }}>
        <input name="text" placeholder="New todo" required style={{ padding: 8, width: '70%' }} />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((t, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggle(i)}
              style={{ marginRight: 8 }}
            />
            <span style={{ flexGrow: 1, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</span>
            <button onClick={() => deleteTodo(i)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}