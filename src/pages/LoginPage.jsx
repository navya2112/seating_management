import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login check
    if (username === 'admin' && password === 'admin') {
      navigate('/location');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
  <label htmlFor="password" className="form-label">Password</label>
  <input
    type="password"
    className="form-control"
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>

        <button type="submit" className="btn btn-primary w-100">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
