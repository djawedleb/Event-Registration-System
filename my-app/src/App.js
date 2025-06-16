import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Profile from './pages/Profile';
import MyRegistrations from './pages/MyRegistrations';
import MyEvents from './pages/MyEvents';

// Protected Route component for role-based access
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to={userRole === 'organizer' ? '/my-events' : '/events'} replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />

                {/* Visitor routes */}
                <Route 
                    path="/events" 
                    element={
                        <ProtectedRoute allowedRoles={['visitor']}>
                            <Events />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/my-registrations" 
                    element={
                        <ProtectedRoute allowedRoles={['visitor']}>
                            <MyRegistrations />
                        </ProtectedRoute>
                    } 
                />

                {/* Organizer routes */}
                <Route 
                    path="/my-events" 
                    element={
                        <ProtectedRoute allowedRoles={['organizer']}>
                            <MyEvents />
                        </ProtectedRoute>
                    } 
                />

                {/* Common routes (accessible by both roles) */}
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute allowedRoles={['visitor', 'organizer']}>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;