import React from 'react';
import AuthForm from '../components/AuthForm';
import EventIcon from '@mui/icons-material/Event';
import '../Styles/Home.css';

const bgStyle = {
  minHeight: "100vh",
  minWidth: "100vw",
  backgroundImage: "linear-gradient(120deg, rgba(224,231,255,0.55) 0%, rgba(247,250,252,0.55) 100%), url('/abstract-blur-shopping-mall.webp')",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const Home = () => {
    return (
        <div style={bgStyle}>
            <div className="home-content">
                <div className="welcome-section">

                    <h1 className="welcome-title">Welcome to Eventify</h1>
                    <h2 className="welcome-subtitle">Your Gateway to Amazing Events</h2>
                    <p className="welcome-desc">Join our events, connect with others, and make every moment count.</p>
                </div>
                <div className="auth-section glass-card">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
};

export default Home;