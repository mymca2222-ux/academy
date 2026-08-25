import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', course: '', semester: '' });
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (form.course) {
      api.get(`/semesters?course=${form.course}`).then(res => setSemesters(res.data));
    } else {
      setSemesters([]);
    }
  }, [form.course]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="course" value={form.course} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select name="semester" value={form.semester} onChange={handleChange} required disabled={!form.course}>
          <option value="">Select Semester</option>
          {semesters.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
