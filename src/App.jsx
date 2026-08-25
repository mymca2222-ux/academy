import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import StudentForm from './components/StudentForm';
import ViewStudents from './components/ViewStudents';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<StudentForm />} />
          <Route path="/view" element={<ViewStudents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
