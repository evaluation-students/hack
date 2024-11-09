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

  const handleLoginSuccess = (role) => {
    console.log('Login success, role:', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  console.log('Rendering App, isAuthenticated:', isAuthenticated, 'userRole:', userRole);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={isAuthenticated && userRole === 'student' ? <StudentPage /> : <Navigate to="/" />} />
        <Route path="/teacher" element={isAuthenticated && userRole === 'teacher' ? <TeacherPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;