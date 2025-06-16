import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import '../Styles/EventCard.css';

const EventCard = ({ event, onRegister }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [open, setOpen] = useState(false);
    const SERVER_URL = 'http://localhost:5000'; // Add server URL constant

    useEffect(() => {
        checkRegistrationStatus();
    }, [event._id]);

    const checkRegistrationStatus = async () => {
        try {
            const response = await eventAPI.checkRegistration(event._id);
            setIsRegistered(response.data.isRegistered);
            if (response.data.registration) {
                setRegistrationId(response.data.registration._id);
            }
        } catch (error) {
            console.error('Error checking registration status:', error);
        }
    };

    const handleRegister = async () => {
        try {
            setIsRegistering(true);
            setError('');
            await eventAPI.registerForEvent(event._id);
            await checkRegistrationStatus();
            onRegister(); // Refresh the events list
            setOpen(false); // Close modal after registration
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to register');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        try {
            setIsRegistering(true);
            setError('');
            await eventAPI.cancelRegistration(registrationId);
            setIsRegistered(false);
            setRegistrationId(null);
            onRegister(); // Refresh the events list
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to cancel registration');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setError('');
    };
    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    return (
        <div className="event-card">
            <img 
                src={event.image ? `${SERVER_URL}${event.image}` : '/default-event.jpg'} 
                alt={event.name} 
                className="event-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-event.jpg';
                }}
            />
            <div className="event-details">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <div className="event-info">
                    <p>📍 {event.location}</p>
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p>⏰ {event.time}</p>
                    <p>💰 ${event.price}</p>
                </div>
                {isRegistered ? (
                    <button 
                        onClick={handleCancelRegistration}
                        disabled={isRegistering}
                        className="cancel-btn"
                    >
                        {isRegistering ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                ) : (
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleOpen}
                        disabled={isRegistering}
                        className="more-details-btn"
                        fullWidth
                    >
                        More Details
                    </Button>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Modal for event details and registration */}
            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: 8,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.6rem', textAlign: 'center', pb: 1 }}>{event.name}</DialogTitle>
                <Divider />
                <DialogContent sx={{ mt: 2, mb: 1 }}>
                    <img 
                        src={event.image ? `${SERVER_URL}${event.image}` : '/default-event.jpg'} 
                        alt={event.name} 
                        style={{ width: '100%', borderRadius: 16, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-event.jpg';
                        }}
                    />
                    <div style={{ display: 'grid', rowGap: 12, fontSize: '1.08rem', color: '#222' }}>
                        <div><strong>Description:</strong> {event.description}</div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <span><strong>📍 Location:</strong> {event.location}</span>
                            <span><strong>💰 Price:</strong> ${event.price}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <span><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                            <span><strong>⏰ Time:</strong> {event.time}</span>
                        </div>
                    </div>
                    {error && <p className="error-message" style={{ marginTop: 16 }}>{error}</p>}
                </DialogContent>
                <DialogActions sx={{ pb: 2, pt: 1, px: 3, justifyContent: 'space-between' }}>
                    <Button onClick={handleClose} color="error" variant="outlined" sx={{ borderRadius: 2, fontWeight: 500, px: 3 }}>
                        Close
                    </Button>
                    <Button 
                        onClick={handleRegister} 
                        color="primary" 
                        variant="contained"
                        disabled={isRegistering || isRegistered}
                        sx={{ borderRadius: 2, fontWeight: 600, px: 3, boxShadow: 2 }}
                    >
                        {isRegistering ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EventCard;