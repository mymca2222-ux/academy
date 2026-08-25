import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function StudentDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (user?.semester?._id) {
      api.get(`/subjects?semester=${user.semester._id}`).then(res => setSubjects(res.data));
    }
  }, [user]);

  useEffect(() => {
    if (!subjects.length) return;
    const ids = subjects.map(s => s._id).join(',');
    Promise.all([
      api.get(`/resources?subject=${ids}`),
      api.get(`/pyqs?subject=${ids}`),
      api.get(`/quizzes?subject=${ids}`),
    ]).then(([r, p, q]) => {
      const c = {};
      subjects.forEach(s => { c[s._id] = { notes: 0, videos: 0, pyqs: 0, quizzes: 0 }; });
      const key = (x) => x.subject?._id || x.subject;
      r.data.forEach(x => { const k = key(x); if (c[k]) { x.type === 'video' ? c[k].videos++ : c[k].notes++; } });
      p.data.forEach(x => { const k = key(x); if (c[k]) c[k].pyqs++; });
      q.data.forEach(x => { const k = key(x); if (c[k]) c[k].quizzes++; });
      setCounts(c);
    });
  }, [subjects]);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Hello, {user.name}</h2>
      <p>{user.course?.name} — {user.semester?.name}</p>
      <h3>Your Subjects</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {subjects.map(s => {
          const c = counts[s._id] || { notes: 0, pyqs: 0, quizzes: 0 };
          return (
            <Link key={s._id} to={`/subject/${s._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h4>{s.name}</h4>
                <p>Notes: {c.notes + c.videos} | PYQs: {c.pyqs} | Quizzes: {c.quizzes}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default StudentDashboard;
