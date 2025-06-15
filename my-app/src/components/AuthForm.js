import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Login
                const response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', response.data.token);
                navigate('/events');
            } else {
                // Register
                const response = await authAPI.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', response.data.token);
                navigate('/events');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-form-container">
            {/* Tabs */}
            <div className="auth-tabs">
                <button 
                    className={isLogin ? 'active' : ''} 
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button 
                    className={!isLogin ? 'active' : ''} 
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit">
                    {isLogin ? (
                        <>
                            <LoginIcon className="submit-icon" /> Login
                        </>
                    ) : (
                        <>
                            <AppRegistrationIcon className="submit-icon" /> Register
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;