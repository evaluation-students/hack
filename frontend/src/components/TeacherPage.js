// frontend/src/components/TeacherPage.js
import React, { useState } from 'react';
import './TeacherPage.css';

const TeacherPage = ({ username }) => {
  const [file, setFile] = useState(null);
  const [homeworkDescription, setHomeworkDescription] = useState('');

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

  return (
    <div className="teacher-container">
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
    </div>
  );
};

export default TeacherPage;