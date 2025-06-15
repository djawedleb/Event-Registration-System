import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const registerUser = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id; // Get user ID from authenticated request

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is already registered
        const existingRegistration = await Registration.findOne({ userId, eventId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Create registration
        const registration = await Registration.create({ userId, eventId });
        
        // Populate user and event details
        await registration.populate('userId', 'name email');
        await registration.populate('eventId', 'name date time location');

        res.status(201).json({
            message: 'Registration successful',
            registration
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event', error: error.message });
    }
};

export const getRegistrations = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        const registrations = await Registration.find({ userId })
            .populate('userId', 'name email')
            .populate('eventId', 'name date time location');
        
        res.status(200).json({
            message: 'Registrations fetched successfully',
            registrations
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
};

export const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Get user ID from authenticated request

        // Find registration and verify ownership
        const registration = await Registration.findOne({ _id: id, userId });
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found or unauthorized' });
        }

        await registration.deleteOne();
        res.status(200).json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling registration', error: error.message });
    }
};

export const checkRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id; // Get user ID from authenticated request

        const registration = await Registration.findOne({ userId, eventId });
        res.status(200).json({
            isRegistered: !!registration,
            registration: registration || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking registration status', error: error.message });
    }
};