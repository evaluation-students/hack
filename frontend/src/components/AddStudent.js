import React, { useState } from 'react';

function AddStudent() {
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, grade })
        });
        if (response.ok) {
            setName('');
            setGrade('');
        } else {
            console.error('Failed to add student');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade" required />
            <button type="submit">Add Student</button>
        </form>
    );
}

export default AddStudent;