import React, { createContext, useContext, useState, useCallback } from 'react';
import { eventAPI } from '../services/api';

const EventContext = createContext();

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all events (for visitors)
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await eventAPI.getEvents();
            setEvents(response.data.events || []);
        } catch (err) {
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch organizer's events
    const fetchMyEvents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await eventAPI.getMyEvents();
            setEvents(response.data.events || []);
        } catch (err) {
            setError('Failed to fetch your events');
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new event
    const createEvent = useCallback(async (eventData) => {
        setError('');
        try {
            const response = await eventAPI.createEvent(eventData);
            setEvents(prev => [...prev, response.data.event]);
            return response.data.event;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
            throw err;
        }
    }, []);

    // Update event
    const updateEvent = useCallback(async (eventId, eventData) => {
        setError('');
        try {
            const response = await eventAPI.updateEvent(eventId, eventData);
            setEvents(prev => prev.map(event => 
                event._id === eventId ? response.data.event : event
            ));
            return response.data.event;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
            throw err;
        }
    }, []);

    // Delete event
    const deleteEvent = useCallback(async (eventId) => {
        setError('');
        try {
            await eventAPI.deleteEvent(eventId);
            setEvents(prev => prev.filter(event => event._id !== eventId));
        } catch (err) {
            setError('Failed to delete event');
            throw err;
        }
    }, []);

    // Register for event
    const registerForEvent = useCallback(async (eventId) => {
        setError('');
        try {
            const response = await eventAPI.registerForEvent(eventId);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event');
            throw err;
        }
    }, []);

    // Cancel registration
    const cancelRegistration = useCallback(async (registrationId) => {
        setError('');
        try {
            await eventAPI.cancelRegistration(registrationId);
        } catch (err) {
            setError('Failed to cancel registration');
            throw err;
        }
    }, []);

    // Get event participants
    const getEventParticipants = useCallback(async (eventId) => {
        setError('');
        try {
            const response = await eventAPI.getEventParticipants(eventId);
            return response.data.participants;
        } catch (err) {
            setError('Failed to fetch participants');
            throw err;
        }
    }, []);

    const value = {
        events,
        loading,
        error,
        fetchEvents,
        fetchMyEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        getEventParticipants
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}; 