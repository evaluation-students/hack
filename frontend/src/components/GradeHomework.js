// frontend/src/components/GradeHomework.js
import React, { useState, useEffect } from 'react';
import './GradeHomework.css';

const GradeHomework = ({ username }) => {
  const [homeworks, setHomeworks] = useState([]);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [gradedUsername, setGradedUsername] = useState('');
  const [teacherPreferences, setTeacherPreferences] = useState('');
  const [severity, setSeverity] = useState('');

  useEffect(() => {
    // Fetch homeworks to grade from the backend
    fetch(`http://localhost:5000/user-homeworks?username=${username}`, {
      headers: { 'x-access-token': localStorage.getItem('token') }
    })
      .then(response => response.json())
      .then(data => setHomeworks(data))
      .catch(error => console.error('Error fetching homeworks:', error));
  }, [username]);

  const handleGradeHomework = async (e) => {
    e.preventDefault();
    const gradingData = {
        homework: selectedHomework,
        graded_username: gradedUsername,
        preferences: teacherPreferences,
        severity: severity
    };

    const response = await fetch('https://pdfgrading-bsgeh0h8e5atdzau.germanywestcentral-01.azurewebsites.net/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gradingData)
    });

    const responseData = await response.json();

    if (response.ok) {
      alert(`Homework graded successfully:\nFeedback: ${responseData.feedback}\nGrade: ${responseData.grade}`);
      setSelectedHomework(null);
      setGradedUsername('');
      setTeacherPreferences('');
      setSeverity('');
    } else {
      alert(`Failed to grade homework:\n${responseData.message}`);
    }
  };

  return (
    <div className="grade-homework-container">
      <h1>Grade Homework</h1>
      <ul className="homework-list">
        {homeworks.map((homework, index) => (
          <li key={index}>
            {homework}
            <button onClick={() => setSelectedHomework(homework)}>Grade</button>
          </li>
        ))}
      </ul>
      {selectedHomework && (
        <div>
          <h2>Grade Homework: {selectedHomework}</h2>
          <form onSubmit={handleGradeHomework}>
            <div className="form-group">
              <label>Graded Username:</label>
              <input
                type="text"
                value={gradedUsername}
                onChange={(e) => setGradedUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Teacher Preferences:</label>
              <input
                type="text"
                value={teacherPreferences}
                onChange={(e) => setTeacherPreferences(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Severity:</label>
              <input
                type="text"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">Grade</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GradeHomework;