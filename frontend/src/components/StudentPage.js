// frontend/src/components/StudentPage.js
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const StudentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [homework, setHomework] = useState(null);

  useEffect(() => {
    // Fetch assignments from the backend
    fetch('http://localhost:5000/assignments', {
      headers: { 'x-access-token': localStorage.getItem('token') }
    })
      .then(response => response.json())
      .then(data => setAssignments(data));
  }, []);

  const handleHomeworkUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('homework', homework);

    const response = await fetch('http://localhost:5000/upload-homework', {
      method: 'POST',
      headers: { 'x-access-token': localStorage.getItem('token') },
      body: formData
    });

    if (response.ok) {
      alert('Homework uploaded successfully');
    } else {
      alert('Failed to upload homework');
    }
  };

  const handleGoogleDriveUpload = () => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
          gapi.client.drive.files.list({
            pageSize: 10,
            fields: 'files(id, name)'
          }).then(response => {
            const files = response.result.files;
            if (files && files.length > 0) {
              const file = files[0]; // Select the first file for simplicity
              gapi.client.drive.files.get({
                fileId: file.id,
                alt: 'media'
              }).then(fileResponse => {
                const blob = new Blob([fileResponse.body], { type: file.mimeType });
                setHomework(blob);
              });
            }
          });
        });
      });
    });
  };

  const handleGitHubUpload = () => {
    const clientId = 'YOUR_GITHUB_CLIENT_ID';
    const redirectUri = 'http://localhost:3000/student';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Student Page</h1>
      <h2>Assignments</h2>
      <ul>
        {assignments.map((assignment, index) => (
          <li key={index}>{assignment.title}</li>
        ))}
      </ul>
      <h2>Upload Homework</h2>
      <form onSubmit={handleHomeworkUpload}>
        <input
          type="file"
          onChange={(e) => setHomework(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
      <button onClick={handleGoogleDriveUpload}>Upload from Google Drive</button>
      <button onClick={handleGitHubUpload}>Upload from GitHub</button>
    </div>
  );
};

export default StudentPage;