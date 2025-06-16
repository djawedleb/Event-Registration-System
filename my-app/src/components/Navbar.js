import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import '../Styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); // Get user role from localStorage

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole'); // Also remove user role on logout
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to={userRole === 'organizer' ? '/my-events' : '/events'}>
                    <EventIcon className="brand-icon" />
                    Eventify {userRole === 'organizer' ? 'Organizer' : ''}
                </Link>
            </div>
            <div className="nav-links">
                {userRole === 'visitor' && (
                    <Link to="/my-registrations" className="nav-link">
                        <EventIcon className="nav-icon" />
                        My Registrations
                    </Link>
                )}
                {userRole === 'organizer' && (
                    <Link to="/my-events" className="nav-link">
                        <EventIcon className="nav-icon" />
                        My Events
                    </Link>
                )}
                <Link to="/profile" className="nav-link">
                    <PersonIcon className="nav-icon" />
                    Profile
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                    <LogoutIcon className="logout-icon" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;