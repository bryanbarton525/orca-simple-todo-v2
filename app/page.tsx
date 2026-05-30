import { useState, useEffect } from 'react';

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('loggedIn');
    setLoggedIn(logged === 'true');
  }, []);

  const toggleLogin = () => {
    const newState = !loggedIn;
    setLoggedIn(newState);
    localStorage.setItem('loggedIn', String(newState));
  };

  const [url, setUrl] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit', url);
  };

  return (
    <main className="p-4">
      <h1>Welcome to the Todo App</h1>
      <p>This is a minimal todo application built with vanilla JS (but using React here for simplicity).</p>
      <button onClick={toggleLogin}>
        {loggedIn ? 'Log out' : 'Log in'}
      </button>
      {loggedIn && (
        <form onSubmit={submit} className="mt-4">
          <label>
            RSS Feed URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add</button>
        </form>
      )}
    </main>
  );
}
