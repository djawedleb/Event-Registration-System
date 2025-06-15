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
        try {
            const [eventsRes, regsRes] = await Promise.all([
                eventAPI.getEvents(),
                eventAPI.getMyRegistrations()
            ]);
            setEvents(eventsRes.data.events);
            const regIds = (regsRes.data.registrations || []).map(reg => reg.eventId?._id || reg.eventId);
            setRegisteredEventIds(regIds);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch events');
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => !registeredEventIds.includes(event._id));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Navbar />
            <div className="events-container">
                <h1>Available Events</h1>
                <div className="events-grid">
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event._id} 
                            event={event} 
                            onRegister={fetchData}  // Refresh list after registration
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;