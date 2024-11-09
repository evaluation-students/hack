// src/App.js
import React, { useState, useEffect } from 'react';
import StudentEvaluationForm from './components/StudentEvaluationForm';
import StudentEvaluationList from './components/StudentEvaluationList';

const App = () => {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    // Fetch initial evaluations from the backend
    fetch('http://localhost:5000/find')
      .then(response => response.json())
      .then(data => setEvaluations(data));
  }, []);

  const addEvaluation = (evaluation) => {
    // Send the new evaluation to the backend
    fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluation),
    })
      .then(response => response.json())
      .then(newEvaluation => {
        setEvaluations([...evaluations, newEvaluation]);
      });
  };

  return (
    <div>
      <h1>Student Evaluation</h1>
      <StudentEvaluationForm addEvaluation={addEvaluation} />
      <StudentEvaluationList evaluations={evaluations} />
    </div>
  );
};

export default App;