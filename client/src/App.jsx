import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SubjectPage from './pages/SubjectPage';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/subject/:id" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
