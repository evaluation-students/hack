// frontend/src/components/TeacherPage.js
import React, { useState } from 'react';

const TeacherPage = () => {
  const [assignmentTitle, setAssignmentTitle] = useState('');

  const handleAssignmentUpload = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/upload-assignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title: assignmentTitle })
    });

    if (response.ok) {
      alert('Assignment uploaded successfully');
      setAssignmentTitle('');
    } else {
      alert('Failed to upload assignment');
    }
  };

  return (
    <div>
      <h1>Teacher Page</h1>
      <h2>Upload Assignment</h2>
      <form onSubmit={handleAssignmentUpload}>
        <input
          type="text"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
          placeholder="Assignment Title"
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default TeacherPage;