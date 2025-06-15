import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../Styles/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('profile'); // profile, update, delete

    // Form states
    const [updateForm, setUpdateForm] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data.user);
            setUpdateForm({
                ...updateForm,
                name: response.data.user.name,
                email: response.data.user.email
            });
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch profile');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords if changing password
        if (updateForm.newPassword) {
            if (updateForm.newPassword !== updateForm.confirmPassword) {
                setError('New passwords do not match');
                return;
            }
            if (updateForm.newPassword.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
        }

        try {
            const updateData = {
                name: updateForm.name,
                email: updateForm.email
            };

            if (updateForm.newPassword) {
                updateData.currentPassword = updateForm.currentPassword;
                updateData.newPassword = updateForm.newPassword;
            }

            await userAPI.updateProfile(updateData);
            setSuccess('Profile updated successfully');
            fetchUserProfile(); // Refresh profile data
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await userAPI.deleteAccount();
                localStorage.removeItem('token');
                navigate('/');
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to delete account');
            }
        }
    };

    const handleInputChange = (e) => {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-content">
                <div className="profile-tabs">
                    <button 
                        className={activeTab === 'profile' ? 'active' : ''} 
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button 
                        className={activeTab === 'update' ? 'active' : ''} 
                        onClick={() => setActiveTab('update')}
                    >
                        Update Profile
                    </button>
                    <button 
                        className={activeTab === 'delete' ? 'active' : ''} 
                        onClick={() => setActiveTab('delete')}
                    >
                        Delete Account
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {activeTab === 'profile' && user && (
                    <div className="profile-info">
                        <h2>Profile Information</h2>
                        <div className="info-group">
                            <label>Name:</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="info-group">
                            <label>Email:</label>
                            <p>{user.email}</p>
                        </div>
                        <div className="info-group">
                            <label>Member Since:</label>
                            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'update' && (
                    <form onSubmit={handleUpdateProfile} className="update-form">
                        <h2>Update Profile</h2>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={updateForm.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={updateForm.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Current Password (required for any changes)</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={updateForm.currentPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password (optional)</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={updateForm.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={updateForm.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="update-btn">Update Profile</button>
                    </form>
                )}

                {activeTab === 'delete' && (
                    <div className="delete-account">
                        <h2>Delete Account</h2>
                        <p>Warning: This action cannot be undone. All your data will be permanently deleted.</p>
                        <button onClick={handleDeleteAccount} className="delete-btn">
                            Delete My Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
