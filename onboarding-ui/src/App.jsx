import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OnboardingWizard from './components/OnboardingWizard';
import AdminConfig from './components/AdminConfig';
import DataTable from './components/DataTable';
function App() {
  return (
    <Router>
      <nav className="h-24 bg-indigo-600 flex items-center justify-between px-8 shadow-md">
          
          <div className="w-1/3"></div>

          
          <div className="text-white text-2xl font-bold text-center w-1/3">
            <Link to="/" className="hover:underline">
              OnBoardingFlow
            </Link>
          </div>

          
          <div className="flex justify-end w-1/3 space-x-4">
            <Link to="/admin">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Admin
              </button>
            </Link>
            <Link to="/data">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Data
              </button>
            </Link>
          </div>
      </nav>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminConfig />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
