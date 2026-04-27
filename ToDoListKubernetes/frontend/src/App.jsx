import { useEffect, useState, useCallback } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const addressapi = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const fetchTodos = useCallback(async () => {
    const res = await fetch(`${addressapi}/todos`);
    const data = await res.json();
    if (!res.ok) {
      const text = await res.text();
      console.error("Erreur back :", res.status, text);
      return;
    }
    setTodos(data);
  }, [addressapi]);

  const addTodo = async () => {
    await fetch(`${addressapi}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTodos();
  };

  const validTodo = async (id) => {
    await fetch(`${addressapi}/todos/${id}`, { method: 'PUT' });
    fetchTodos();
  };


  const deleteTodo = async (id) => {
    await fetch(`${addressapi}/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 Liste de tâches</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche"
      />
      <button onClick={addTodo}>Ajouter</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => validTodo(todo.id)}
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '1rem' }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;