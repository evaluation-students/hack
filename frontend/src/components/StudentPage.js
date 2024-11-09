// frontend/src/components/StudentPage.js
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import './StudentPage.css';

const StudentPage = ({ username }) => {
  const [assignments, setAssignments] = useState([]);
  const [homework, setHomework] = useState(null);
  const [homeworkDescription, setHomeworkDescription] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [plagiarismResult, setPlagiarismResult] = useState(null);



  useEffect(() => {
    // Fetch assignments from the backend
    fetch(`http://localhost:5000/user-assignments?username=${username}`, {
      headers: { 'x-access-token': localStorage.getItem('token') }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setAssignments(data))
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []);

  const handleHomeworkUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', homework);
    formData.append('user_type', 'student');
    formData.append('homework', homeworkDescription);
    formData.append('username', username);

    const response = await fetch('https://pdfgrading-bsgeh0h8e5atdzau.germanywestcentral-01.azurewebsites.net/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      setPlagiarismResult(result);
      alert(`Homework uploaded successfully. Plagiarism: ${result.percentPlagiarism}%`);
      setHomework(null);
      setHomeworkDescription('');
      setSelectedAssignment(null);
    } else {
      alert('Failed to upload homework');
    }
  };

  const handleGoogleDriveUpload = () => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'AIzaSyC17V8YBC6EORSk1ygPLgDvVPruRjhUfzg',
        clientId: '185267538515-m925ba34pm5a7flv3r9ad2adj7fokck2.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
          createPicker();
        });
      });
    });
  };

  const createPicker = () => {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    const picker = new google.picker.PickerBuilder()
      .setAppId('oauth-441214')
      .setOAuthToken(gapi.auth.getToken().access_token)
      .addView(view)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data) => {
    if (data.action === google.picker.Action.PICKED) {
      const file = data.docs[0];
      gapi.client.drive.files.get({
        fileId: file.id,
        alt: 'media'
      }).then(fileResponse => {
        const blob = new Blob([fileResponse.body], { type: file.mimeType });
        setHomework(blob);
      });
    }
  };

  const handleGitHubUpload = () => {
    const clientId = 'Ov23liZuOxkjAYH3CS8L';
    const redirectUri = 'http://localhost:3000/student';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;

    window.location.href = authUrl;
  };

  return (
    <div className="student-container">
      <h1>Student Page</h1>
      <h2>Assignments</h2>
      <ul className="assignment-list">
        {assignments.map((assignment, index) => (
          <li key={index}>
            {assignment}
            <button onClick={() => {
              setSelectedAssignment(assignment);
              setHomeworkDescription(assignment);
            }}>Upload Homework</button>
          </li>
        ))}
      </ul>
      {selectedAssignment && (
        <div>
          <h2>Upload Homework for {selectedAssignment}</h2>
          <form onSubmit={handleHomeworkUpload}>
            <div className="form-group">
              <label>File:</label>
              <input
                type="file"
                onChange={(e) => setHomework(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" className="btn">Upload</button>
          </form>
          <button className="btn" onClick={handleGoogleDriveUpload}>Upload from Google Drive</button>
          <button className="btn" onClick={handleGitHubUpload}>Upload from GitHub</button>
        </div>
      )}
    </div>
  );
};

export default StudentPage;