import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import OrganizerNavbar from '../components/OrganizerNavbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import '../Styles/MyEvents.css';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [participantsError, setParticipantsError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        price: ''
    });
    const navigate = useNavigate();
    const SERVER_URL = 'http://localhost:5000'; // Add server URL constant

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await eventAPI.getMyEvents();
            if (response.data && response.data.events) {
                setEvents(response.data.events);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch your events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (event = null) => {
        if (event) {
            setIsEditing(true);
            setCurrentEvent(event);
            setFormData({
                name: event.name,
                description: event.description,
                date: event.date.split('T')[0],
                time: event.time,
                location: event.location,
                price: event.price
            });
            setImagePreview(event.image || '');
            setSelectedImage(null);
        } else {
            setIsEditing(false);
            setCurrentEvent(null);
            setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                location: '',
                price: ''
            });
            setImagePreview('');
            setSelectedImage(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setError('');
        setSelectedImage(null);
        setImagePreview('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Log the form data before submission
        console.log('Submitting form data:', formData);

        try {
            const submitData = new FormData();
            
            // Add each field individually to ensure proper form data
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('location', formData.location);
            submitData.append('date', formData.date);
            submitData.append('time', formData.time);
            submitData.append('price', formData.price);
            
            if (selectedImage) {
                submitData.append('image', selectedImage);
            }

            // Log the FormData entries
            console.log('FormData entries:');
            for (let pair of submitData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            if (isEditing) {
                await eventAPI.updateEvent(currentEvent._id, submitData);
            } else {
                await eventAPI.createEvent(submitData);
            }
            await fetchMyEvents();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving event:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to save event. Please try again.');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await eventAPI.deleteEvent(eventId);
            await fetchMyEvents();
        } catch (err) {
            console.error('Error deleting event:', err);
            setError('Failed to delete event. Please try again.');
        }
    };

    const handleViewParticipants = async (eventId) => {
        setOpenParticipantsModal(true);
        setLoadingParticipants(true);
        setParticipantsError('');
        try {
            const response = await eventAPI.getEventParticipants(eventId);
            setParticipants(response.data.participants || []);
        } catch (err) {
            console.error('Error fetching participants:', err);
            setParticipantsError('Failed to fetch participants. Please try again.');
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleCloseParticipantsModal = () => {
        setOpenParticipantsModal(false);
        setParticipants([]);
        setParticipantsError('');
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
                <button onClick={fetchMyEvents} className="retry-button">Retry</button>
            </div>
        );
    }

    return (
        <div className="my-events-page">
            <OrganizerNavbar />
            <div className="my-events-container">
                <div className="my-events-header">
                    <h1>My Events</h1>
                    <button 
                        className="create-event-btn"
                        onClick={() => handleOpenModal()}
                    >
                        Create New Event
                    </button>
                </div>

                {events.length === 0 ? (
                    <div className="no-events">
                        <span className="no-events-icon">📅</span>
                        <p>You haven't created any events yet.</p>
                        <button 
                            className="create-first-event-btn"
                            onClick={() => handleOpenModal()}
                        >
                            Create Your First Event
                        </button>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event._id} className="event-card">
                                <img 
                                    src={event.image && event.image.trim() !== '' 
                                        ? `${SERVER_URL}${event.image}` 
                                        : '/default-event.jpg'} 
                                    alt={event.name} 
                                    className="event-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-event.jpg';
                                    }}
                                />
                                <div className="event-content">
                                    <h3>{event.name}</h3>
                                    <p>{event.description}</p>
                                    <div className="event-info">
                                        <p>📍 {event.location}</p>
                                        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                                        <p>⏰ {event.time}</p>
                                        <p>💰 ${event.price}</p>
                                    </div>
                                    <div className="event-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleOpenModal(event)}
                                        >
                                            Edit Event
                                        </button>
                                        <button 
                                            className="participants-btn"
                                            onClick={() => handleViewParticipants(event._id)}
                                        >
                                            View Participants
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteEvent(event._id)}
                                        >
                                            Delete Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Event Modal */}
                <Dialog 
                    open={openModal} 
                    onClose={handleCloseModal}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {isEditing ? 'Edit Event' : 'Create New Event'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <div className="form-grid">
                                <TextField
                                    name="name"
                                    label="Event Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    name="description"
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                    margin="normal"
                                />
                                <TextField
                                    name="date"
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    name="time"
                                    label="Time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    name="location"
                                    label="Location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: '$'
                                    }}
                                />
                                <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="event-image-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="event-image-upload">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            fullWidth
                                        >
                                            {imagePreview ? 'Change Image' : 'Upload Event Image'}
                                        </Button>
                                    </label>
                                    {imagePreview && (
                                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Event preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '200px',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal} color="error">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" variant="contained">
                                {isEditing ? 'Save Changes' : 'Create Event'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Participants Modal */}
                <Dialog 
                    open={openParticipantsModal} 
                    onClose={handleCloseParticipantsModal}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Event Participants
                    </DialogTitle>
                    <DialogContent>
                        {loadingParticipants ? (
                            <div className="loading-container">
                                <div className="loading-spinner">Loading participants...</div>
                            </div>
                        ) : participantsError ? (
                            <div className="error-message">{participantsError}</div>
                        ) : participants.length === 0 ? (
                            <div className="no-participants">
                                <p>No participants have registered for this event yet.</p>
                            </div>
                        ) : (
                            <div className="participants-list">
                                {participants.map((participant) => (
                                    <div key={participant._id} className="participant-card">
                                        <div className="participant-info">
                                            <h4>{participant.name}</h4>
                                            <p>Email: {participant.email}</p>
                                            <p>Registered on: {new Date(participant.registrationDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseParticipantsModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default MyEvents; 