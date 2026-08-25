import { useState, useEffect } from 'react';
import './ViewStudents.css';

function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/students');
      const data = await response.json();

      if (response.ok) {
        setStudents(data.data || []);
      } else {
        setError(data.message || 'Error fetching students');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-students-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-students-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchStudents} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="view-students-container">
      <div className="header-section">
        <h2>All Students</h2>
        <button onClick={fetchStudents} className="refresh-button">
          Refresh
        </button>
      </div>

      {students.length === 0 ? (
        <div className="no-students">
          <p>No students registered yet.</p>
          <p>Register a new student to get started!</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-header">
                <h3>{student.name}</h3>
                <span className="student-id">ID: {student._id.slice(-6)}</span>
              </div>
              <div className="student-details">
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{student.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{student.age}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Course:</span>
                  <span className="detail-value">{student.course}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Grade:</span>
                  <span className="detail-value">{student.grade}</span>
                </div>
                {student.phone && (
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{student.phone}</span>
                  </div>
                )}
                {student.address && (
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{student.address}</span>
                  </div>
                )}
                {student.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Registered:</span>
                    <span className="detail-value">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewStudents;

