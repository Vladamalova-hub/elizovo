import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is already logged in (session storage)
    const savedAuth = sessionStorage.getItem('auth');
    if (savedAuth) {
      const { username } = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUsername(username);
    }
  }, []);

  const handleLogin = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
    sessionStorage.setItem('auth', JSON.stringify({ username: user }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    sessionStorage.removeItem('auth');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
}

export default App;
