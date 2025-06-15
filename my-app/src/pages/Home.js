import React from 'react';
import AuthForm from '../components/AuthForm';
import '../Styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Welcome Section */}
            <div className="welcome-section">
                <h1>Welcome to Eventify</h1>
                <p>Join our events and connect with others</p>
            </div>

            {/* Auth Forms Section */}
            <div className="auth-section">
                <AuthForm />
            </div>
        </div>
    );
};

export default Home;