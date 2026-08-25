import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a237e', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>PDR</Link>
      {user ? (
        <>
          <span style={{ marginLeft: 'auto' }}>Hi, {user.name}</span>
          {user.role === 'admin' && <Link to="/admin" style={{ color: '#fff' }}>Admin</Link>}
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#fff', marginLeft: 'auto' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
