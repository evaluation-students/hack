// frontend/src/components/StudentEvaluationList.js
import React from 'react';

const StudentEvaluationList = ({ evaluations }) => {
  return (
    <div>
      <h2>Student Evaluations</h2>
      <ul>
        {evaluations.map((evaluation, index) => (
          <li key={index}>
            {evaluation.name}: {evaluation.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentEvaluationList;