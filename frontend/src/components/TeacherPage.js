// frontend/src/components/TeacherPage.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import GradeHomework from './GradeHomework';
import './TeacherPage.css';

const TeacherPage = ({ username }) => {
  const [file, setFile] = useState(null);
  const [homeworkDescription, setHomeworkDescription] = useState('');
  const [homeworks, setHomeworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch homeworks for the logged-in user from the backend
    fetch(`http://localhost:5000/user-homeworks?username=${username}`, {
      headers: { 'x-access-token': localStorage.getItem('token') }
    })
      .then(response => response.json())
      .then(data => setHomeworks(data))
      .catch(error => console.error('Error fetching homeworks:', error));
  }, [username]);

  const handleAssignmentUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_type', 'teacher');
    formData.append('homework', homeworkDescription);
    formData.append('username', username);

    const response = await fetch('https://pdfgrading-bsgeh0h8e5atdzau.germanywestcentral-01.azurewebsites.net/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Assignment uploaded successfully');
      setFile(null);
      setHomeworkDescription('');
    } else {
      alert('Failed to upload assignment');
    }
  };

  const handleExportHomework = async (homeworkName) => {
    const response = await fetch(`https://pdfgrading-bsgeh0h8e5atdzau.germanywestcentral-01.azurewebsites.net/export?homework_name=${homeworkName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${homeworkName}.xlsx`; // Adjust the file extension as needed
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('Export successful');
      } else {
        alert('Failed to export homework');
      }
  };

  return (
    <div className="teacher-container">
      <div className="left-section">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Teacher Page</h1>
              <h2>Upload Assignment</h2>
              <form onSubmit={handleAssignmentUpload}>
                <div className="form-group">
                  <label>File:</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Homework Description:</label>
                  <input
                    type="text"
                    value={homeworkDescription}
                    onChange={(e) => setHomeworkDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn">Upload</button>
              </form>
              <button className="btn" onClick={() => navigate('grade-homework')}>View and Grade Submitted Homeworks</button>
            </div>
          } />
          <Route path="grade-homework" element={<GradeHomework username={username} />} />
        </Routes>
      </div>
      <div className="right-section">
        <h2>Submitted Homeworks</h2>
        <ul className="homework-list">
          {homeworks.map((homework, index) => (
            <li key={index}>
              {homework}
              <button onClick={() => handleExportHomework(homework)}>Export</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherPage;