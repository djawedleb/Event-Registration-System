import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import '../Styles/Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [eventsRes, regsRes] = await Promise.all([
                eventAPI.getEvents(),
                eventAPI.getMyRegistrations()
            ]);
            if (eventsRes.data && eventsRes.data.events) {
                setEvents(eventsRes.data.events);
            }
            if (regsRes.data && regsRes.data.registrations) {
                const regIds = regsRes.data.registrations.map(reg => reg.eventId?._id || reg.eventId);
                setRegisteredEventIds(regIds);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => !registeredEventIds.includes(event._id));

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
                <button onClick={fetchData} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="events-page">
            <Navbar />
            <div className="events-container">
                <h1>Available Events</h1>
                {filteredEvents.length === 0 ? (
                    <div className="no-events">
                        <p>No events available at the moment.</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {filteredEvents.map(event => (
                            <EventCard 
                                key={event._id} 
                                event={event} 
                                onRegister={fetchData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;