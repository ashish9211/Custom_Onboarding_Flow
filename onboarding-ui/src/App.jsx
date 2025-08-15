
import './App.css'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import DataPage from './pages/DataPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Homepage from './pages/HomePage';
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Router>
  );
}

export default App;
