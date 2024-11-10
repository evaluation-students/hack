// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentPage from './components/StudentPage';
import TeacherPage from './components/TeacherPage';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (role, username) => {
    console.log('Login success, role:', role, 'username:', username);
    setIsAuthenticated(true);
    setUserRole(role);
    setUsername(username);
  };

  console.log('Rendering App, isAuthenticated:', isAuthenticated, 'userRole:', userRole, 'username:', username);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={isAuthenticated && userRole === 'student' ? <StudentPage username={username} /> : <Navigate to="/" />} />
        <Route path="/teacher/*" element={isAuthenticated && userRole === 'teacher' ? <TeacherPage username={username} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;