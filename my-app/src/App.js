import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Profile from './pages/Profile';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
      </Routes>
    </Router>
  );
}

export default App;