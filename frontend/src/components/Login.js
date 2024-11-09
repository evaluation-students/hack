// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login form');
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.role, username); // Pass the user role and username to the success handler
      navigate(data.role === 'student' ? '/student' : '/teacher');
    } else {
      console.error('Login failed:', data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <button className="btn" onClick={() => navigate('/register')}>Go to Register</button>
    </div>
  );
};

export default Login;