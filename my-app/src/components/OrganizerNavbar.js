import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import '../Styles/Navbar.css';

const OrganizerNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            navigate('/');
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/my-events">
                    <EventIcon className="brand-icon" />
                    Eventify Organizer
                </Link>
            </div>
            <div className="nav-links">
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

export default OrganizerNavbar; 