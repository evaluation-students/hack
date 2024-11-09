// frontend/src/components/StudentEvaluationForm.js
import React, { useState } from 'react';

const StudentEvaluationForm = ({ addEvaluation }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvaluation({ name, grade });
    setName('');
    setGrade('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Grade:</label>
        <input
          type="text"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
      </div>
      <button type="submit">Add Evaluation</button>
    </form>
  );
};

export default StudentEvaluationForm;