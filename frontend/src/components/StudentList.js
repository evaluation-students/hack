import React, { useEffect, useState } from 'react';

function StudentList() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await fetch('/students');
            const data = await response.json();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    return (
        <ul>
            {students.map(student => (
                <li key={student.id}>{student.name} - {student.grade}</li>
            ))}
        </ul>
    );
}

export default StudentList;