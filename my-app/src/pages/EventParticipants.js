import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import Navbar from '../components/Navbar';
import '../Styles/EventParticipants.css';

const EventParticipants = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEventAndParticipants();
    }, [eventId]);

    const fetchEventAndParticipants = async () => {
        try {
            const [eventRes, participantsRes] = await Promise.all([
                eventAPI.getEvent(eventId),
                eventAPI.getEventParticipants(eventId)
            ]);
            setEvent(eventRes.data.event);
            setParticipants(participantsRes.data.participants || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch event participants');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={fetchEventAndParticipants} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="participants-page">
            <Navbar />
            <div className="participants-container">
                <div className="participants-header">
                    <button 
                        className="back-button"
                        onClick={() => navigate('/my-events')}
                    >
                        ← Back to Events
                    </button>
                    <h1>Event Participants</h1>
                    <h2 className="event-title">{event?.name}</h2>
                </div>

                {participants.length === 0 ? (
                    <div className="no-participants">
                        <span className="no-participants-icon">👥</span>
                        <p>No participants have registered for this event yet.</p>
                    </div>
                ) : (
                    <div className="participants-grid">
                        {participants.map((participant) => (
                            <div key={participant._id} className="participant-card">
                                <div className="participant-info">
                                    <div className="participant-name">{participant.userId.name}</div>
                                    <div className="participant-email">{participant.userId.email}</div>
                                    <div className="registration-date">
                                        Registered on: {new Date(participant.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventParticipants; 