import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import api from '../utils/api';

function CrudList({ title, endpoint, fields, itemLabel }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [fieldOptions, setFieldOptions] = useState({});

  const fetch = () => api.get(endpoint).then(res => setItems(res.data));

  useEffect(() => { fetch(); }, [endpoint]);

  useEffect(() => {
    fields.forEach(f => {
      if (f.optionsEndpoint) {
        api.get(f.optionsEndpoint).then(res => {
          const opts = res.data.map(o => ({
            value: o[f.optionValue || '_id'],
            label: f.optionLabel ? f.optionLabel(o) : (o.name || o.title || o._id),
          }));
          setFieldOptions(prev => ({ ...prev, [f.name]: opts }));
        });
      } else if (f.options) {
        setFieldOptions(prev => ({ ...prev, [f.name]: f.options }));
      }
    });
  }, [fields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    fields.forEach(f => {
      if (f.type === 'number') payload[f.name] = Number(payload[f.name]);
      if (f.type === 'json') payload[f.name] = JSON.parse(payload[f.name] || '[]');
    });
    if (editing) {
      await api.put(`${endpoint}/${editing}`, payload);
      setEditing(null);
    } else {
      await api.post(endpoint, payload);
    }
    setForm({});
    fetch();
  };

  const handleEdit = (item) => {
    const f = { ...item };
    fields.forEach(field => {
      if (field.type === 'json') f[field.name] = JSON.stringify(item[field.name] || [], null, 2);
    });
    setForm(f);
    setEditing(item._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete?')) {
      await api.delete(`${endpoint}/${id}`);
      fetch();
    }
  };

  const renderField = (f) => {
    const options = fieldOptions[f.name] || [];
    if (f.type === 'select' || f.type === 'ref') {
      return (
        <select key={f.name} value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required={f.required}>
          <option value="">{f.label}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (f.type === 'textarea' || f.type === 'json') {
      return <textarea key={f.name} placeholder={f.label} value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required={f.required} rows={f.rows || 3} />;
    }
    return <input key={f.name} type={f.type || 'text'} placeholder={f.label} value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} required={f.required} />;
  };

  const defaultLabel = (item) => {
    const text = item.name || item.title || JSON.stringify(item);
    return <>{text} <code style={{ fontSize: '0.8rem', color: '#666' }}>({item._id})</code></>;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>{title}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {fields.map(renderField)}
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {itemLabel ? itemLabel(item) : defaultLabel(item)}
            <button onClick={() => handleEdit(item)} style={{ marginLeft: '0.5rem' }}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Courses() {
  return <CrudList title="Courses" endpoint="/courses" fields={[{ name: 'name', label: 'Name', required: true }, { name: 'code', label: 'Code', required: true }]} />;
}

function Semesters() {
  return <CrudList
    title="Semesters"
    endpoint="/semesters"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'number', label: 'Number', required: true, type: 'number' },
      { name: 'course', label: 'Course', required: true, type: 'ref', optionsEndpoint: '/courses' },
    ]}
  />;
}

function Subjects() {
  return <CrudList
    title="Subjects"
    endpoint="/subjects"
    fields={[
      { name: 'name', label: 'Name', required: true },
      { name: 'code', label: 'Code' },
      { name: 'semester', label: 'Semester', required: true, type: 'ref', optionsEndpoint: '/semesters', optionLabel: s => `${s.name} (${s.course?.name || ''})` },
    ]}
  />;
}

function Resources() {
  return (
    <CrudList
      title="Resources (Notes / Videos)"
      endpoint="/resources"
      fields={[
        { name: 'type', label: 'Type', required: true, type: 'select', options: [{ value: 'notes', label: 'Notes' }, { value: 'video', label: 'Video' }] },
        { name: 'title', label: 'Title', required: true },
        { name: 'subject', label: 'Subject', required: true, type: 'ref', optionsEndpoint: '/subjects', optionLabel: s => `${s.name} (${s.semester?.course?.name || ''} ${s.semester?.name || ''})` },
        { name: 'unit', label: 'Unit' },
        { name: 'url', label: 'URL', required: true },
        { name: 'description', label: 'Description' },
      ]}
    />
  );
}

function PYQs() {
  return (
    <CrudList
      title="PYQs"
      endpoint="/pyqs"
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'year', label: 'Year', required: true },
        { name: 'subject', label: 'Subject', required: true, type: 'ref', optionsEndpoint: '/subjects', optionLabel: s => `${s.name} (${s.semester?.course?.name || ''} ${s.semester?.name || ''})` },
        { name: 'url', label: 'URL', required: true },
      ]}
    />
  );
}

function Quizzes() {
  const quizLabel = (item) => {
    const unitText = item.unit ? ` — Unit ${item.unit.toString().replace(/^Unit\s*/i, '')}` : '';
    return <>{item.title}{unitText} <code style={{ fontSize: '0.8rem', color: '#666' }}>({item._id})</code></>;
  };

  return (
    <CrudList
      title="Quizzes"
      endpoint="/quizzes"
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'subject', label: 'Subject', required: true, type: 'ref', optionsEndpoint: '/subjects', optionLabel: s => `${s.name} (${s.semester?.course?.name || ''} ${s.semester?.name || ''})` },
        { name: 'unit', label: 'Unit' },
        { name: 'questions', label: 'Questions JSON', required: true, type: 'json', rows: 8 },
      ]}
      itemLabel={quizLabel}
    />
  );
}

function AdminDashboard() {
  return (
    <div>
      <div style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h2>Admin Dashboard</h2>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/courses">Courses</Link>
          <Link to="/admin/semesters">Semesters</Link>
          <Link to="/admin/subjects">Subjects</Link>
          <Link to="/admin/resources">Resources</Link>
          <Link to="/admin/pyqs">PYQs</Link>
          <Link to="/admin/quizzes">Quizzes</Link>
        </nav>
      </div>
      <Routes>
        <Route path="courses" element={<Courses />} />
        <Route path="semesters" element={<Semesters />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="resources" element={<Resources />} />
        <Route path="pyqs" element={<PYQs />} />
        <Route path="quizzes" element={<Quizzes />} />
        <Route path="*" element={<p>Select a section above.</p>} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
