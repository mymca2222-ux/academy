import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

function NotesList({ subjectId }) {
  const [notes, setNotes] = useState([]);
  useEffect(() => { api.get(`/resources?subject=${subjectId}&type=notes`).then(res => setNotes(res.data)); }, [subjectId]);
  return (
    <ul>
      {notes.map(n => (
        <li key={n._id}>
          <strong>{n.title}</strong> {n.unit && `— Unit ${n.unit}`}
          <p>{n.description}</p>
          <a href={n.url} target="_blank" rel="noreferrer">Open</a>
        </li>
      ))}
      {notes.length === 0 && <p>No notes yet.</p>}
    </ul>
  );
}

function VideosList({ subjectId }) {
  const [videos, setVideos] = useState([]);
  useEffect(() => { api.get(`/resources?subject=${subjectId}&type=video`).then(res => setVideos(res.data)); }, [subjectId]);
  return (
    <ul>
      {videos.map(v => (
        <li key={v._id}>
          <strong>{v.title}</strong> {v.unit && `— Unit ${v.unit}`}
          <p>{v.description}</p>
          {v.url.includes('youtube') || v.url.includes('youtu.be') ? (
            <iframe width="560" height="315" src={v.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} title={v.title} allowFullScreen />
          ) : (
            <a href={v.url} target="_blank" rel="noreferrer">Watch</a>
          )}
        </li>
      ))}
      {videos.length === 0 && <p>No videos yet.</p>}
    </ul>
  );
}

function PYQsList({ subjectId }) {
  const [pyqs, setPyqs] = useState([]);
  useEffect(() => { api.get(`/pyqs?subject=${subjectId}`).then(res => setPyqs(res.data)); }, [subjectId]);
  return (
    <ul>
      {pyqs.map(p => (
        <li key={p._id}>
          {p.year} — {p.title} <a href={p.url} target="_blank" rel="noreferrer">View PYQ</a>
        </li>
      ))}
      {pyqs.length === 0 && <p>No PYQs yet.</p>}
    </ul>
  );
}

function QuizTab({ subjectId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => { api.get(`/quizzes?subject=${subjectId}`).then(res => setQuizzes(res.data)); }, [subjectId]);

  const startQuiz = async (quizId) => {
    const res = await api.get(`/quizzes/${quizId}`);
    setActiveQuiz(res.data);
    setAnswers(new Array(res.data.questions.length).fill(-1));
    setResult(null);
  };

  const submit = async () => {
    const res = await api.post(`/quizzes/${activeQuiz._id}/attempt`, { answers });
    setResult(res.data);
  };

  if (result) {
    return (
      <div>
        <h4>Score: {result.score}/{result.total}</h4>
        <p>Correct: {result.correct} | Wrong: {result.wrong}</p>
        <button onClick={() => { setActiveQuiz(null); setResult(null); }}>Back</button>
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <div>
        <h4>{activeQuiz.title}</h4>
        {activeQuiz.questions.map((q, i) => (
          <div key={q._id} style={{ marginBottom: '1rem' }}>
            <p><strong>{i + 1}. {q.question}</strong></p>
            {q.options.map((opt, j) => (
              <label key={j} style={{ display: 'block' }}>
                <input type="radio" name={`q-${i}`} checked={answers[i] === j} onChange={() => {
                  const a = [...answers]; a[i] = j; setAnswers(a);
                }} /> {String.fromCharCode(65 + j)}. {opt}
              </label>
            ))}
          </div>
        ))}
        <button onClick={submit}>Submit</button>
      </div>
    );
  }

  return (
    <ul>
      {quizzes.map(q => (
        <li key={q._id}>
          {q.title} {q.unit && `— Unit ${q.unit}`} <button onClick={() => startQuiz(q._id)}>Start</button>
        </li>
      ))}
      {quizzes.length === 0 && <p>No quizzes yet.</p>}
    </ul>
  );
}

function SubjectPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [active, setActive] = useState('notes');

  useEffect(() => {
    api.get('/subjects').then(res => {
      const found = res.data.find(s => s._id === id);
      setSubject(found);
    });
  }, [id]);

  if (!subject) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{subject.name}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['notes', 'videos', 'pyqs', 'quiz'].map(t => (
          <button key={t} onClick={() => setActive(t)} style={{ textTransform: 'capitalize', fontWeight: active === t ? 'bold' : 'normal' }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
        {active === 'notes' && <NotesList subjectId={id} />}
        {active === 'videos' && <VideosList subjectId={id} />}
        {active === 'pyqs' && <PYQsList subjectId={id} />}
        {active === 'quiz' && <QuizTab subjectId={id} />}
      </div>
    </div>
  );
}

export default SubjectPage;
