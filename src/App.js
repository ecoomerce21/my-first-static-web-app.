import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreatorView from './pages/CreatorView';
import ConsumerView from './pages/ConsumerView';
import './App.css';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <Link to="/creator" style={{ marginRight: '1rem' }}>Creator View</Link>
        <Link to="/consumer">Consumer View</Link>
      </div>
      
      <Routes>
        <Route path="/creator" element={<CreatorView />} />
        <Route path="/consumer" element={<ConsumerView />} />
        <Route path="/" element={<h1 style={{ padding: '2rem' }}>Welcome to Video Sharing App!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
