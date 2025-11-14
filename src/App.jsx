import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import Auth from './components/Auth/Auth';
import { AuthProvider } from './contexts/authContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
