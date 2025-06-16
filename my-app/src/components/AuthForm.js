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
        password: '',
        role: 'visitor' // Default role
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Submitting auth form:', { isLogin, formData });
            
            let response;
            if (isLogin) {
                // Login
                response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Register
                response = await authAPI.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
            }

            console.log('Auth response:', response.data);

            if (!response.data.token || !response.data.user || !response.data.user.role) {
                throw new Error('Invalid response from server');
            }

            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', response.data.user.role);
            
            console.log('Auth successful, stored data:', {
                token: 'exists',
                role: response.data.user.role
            });

            // Navigate based on role
            const targetPath = response.data.user.role === 'organizer' ? '/my-events' : '/events';
            console.log('Navigating to:', targetPath);
            navigate(targetPath);

        } catch (error) {
            console.error('Auth error:', error);
            setError(error.response?.data?.message || 'Authentication failed. Please try again.');
            // Clear any partial auth data
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Form field changed:', { name, value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="auth-form-container">
            {/* Tabs */}
            <div className="auth-tabs">
                <button 
                    className={isLogin ? 'active' : ''} 
                    onClick={() => setIsLogin(true)}
                    disabled={isLoading}
                >
                    Login
                </button>
                <button 
                    className={!isLogin ? 'active' : ''} 
                    onClick={() => setIsLogin(false)}
                    disabled={isLoading}
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
                            disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                </div>

                {!isLogin && (
                    <div className="form-group">
                        <label>Choose Your Role</label>
                        <div className="role-selection">
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="visitor"
                                    checked={formData.role === 'visitor'}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <span className="radio-custom"></span>
                                <div className="role-content">
                                    <span className="role-title">Visitor</span>
                                    <span className="role-description">Browse and register for events</span>
                                </div>
                            </label>
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    value="organizer"
                                    checked={formData.role === 'organizer'}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <span className="radio-custom"></span>
                                <div className="role-content">
                                    <span className="role-title">Event Organizer</span>
                                    <span className="role-description">Create and manage your events</span>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        'Processing...'
                    ) : isLogin ? (
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