import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <h1 className="nav-title">Student Management System</h1>
        <div className="nav-links">
          <Link 
            to="/register" 
            className={location.pathname === '/register' ? 'nav-link active' : 'nav-link'}
          >
            Register Student
          </Link>
          <Link 
            to="/view" 
            className={location.pathname === '/view' ? 'nav-link active' : 'nav-link'}
          >
            View Students
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;

