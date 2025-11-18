import { useState } from 'react';
import './StudentForm.css';

function StudentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: '',
    grade: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSubmitMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }

    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Student data saved successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          age: '',
          course: '',
          grade: '',
          phone: '',
          address: ''
        });
        setErrors({});
      } else {
        setSubmitMessage(data.message || 'Error saving student data');
        if (data.errors) {
          const errorObj = {};
          data.errors.forEach((error, index) => {
            // Try to map errors to fields
            const field = Object.keys(formData).find(key => 
              error.toLowerCase().includes(key.toLowerCase())
            );
            if (field) {
              errorObj[field] = error;
            }
          });
          setErrors(prev => ({ ...prev, ...errorObj }));
        }
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check if the server is running.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="student-form-container">
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter student name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter email address"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">
            Age <span className="required">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? 'error' : ''}
            placeholder="Enter age"
            min="1"
            max="120"
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course">
            Course <span className="required">*</span>
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className={errors.course ? 'error' : ''}
            placeholder="Enter course name"
          />
          {errors.course && <span className="error-message">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="grade">
            Grade <span className="required">*</span>
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className={errors.grade ? 'error' : ''}
            placeholder="Enter grade"
          />
          {errors.grade && <span className="error-message">{errors.grade}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Enter address"
          />
        </div>

        {submitMessage && (
          <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;


