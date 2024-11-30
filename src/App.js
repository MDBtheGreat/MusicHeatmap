import React from 'react';
import CalendarHeatmap from './CalendarHeatmap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to my Listening History</h1>} />
        <Route path="/MusicHeatmap" element={<CalendarHeatmap />} />
      </Routes>
    </Router>
  );
}

export default App;