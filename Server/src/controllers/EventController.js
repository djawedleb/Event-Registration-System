import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const AddEvent = async (req, res) => {
    try {
        const { name, description, location, date, time, price } = req.body;
        const organizer = req.user.id; // Get organizer ID from authenticated request

        // Get the uploaded file path
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        console.log('Uploaded file info:', req.file);
        console.log('Image path being stored:', image);

        if (!image) {
            return res.status(400).json({ message: 'Event image is required' });
        }

        const event = await Event.create({
            name,
            description,
            location,
            date,
            time,
            image,
            price,
            organizer
        });

        console.log('Created event with image:', event.image);
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        console.error('Add event error:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

export const GetEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name email');
        if (!events) {
            return res.status(404).json({ message: 'No events found' });
        }
        res.status(200).json({ message: 'Events fetched successfully', events });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

export const GetMyEvents = async (req, res) => {
    try {
        const organizer = req.user.id; // Get organizer ID from authenticated request
        const events = await Event.find({ organizer }).populate('organizer', 'name email');
        
        res.status(200).json({ message: 'Events fetched successfully', events });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({ message: 'Error fetching your events', error: error.message });
    }
};

export const GetEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('organizer', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event fetched successfully', event });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

export const UpdateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, date, time, price } = req.body;
        const organizer = req.user.id; // Get organizer ID from authenticated request

        // Find event and verify ownership
        const event = await Event.findOne({ _id: id, organizer });
        if (!event) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        // Get the uploaded file path if a new image was uploaded
        const image = req.file ? `/uploads/${req.file.filename}` : event.image;

        // Update event
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, description, location, date, time, image, price },
            { new: true }
        ).populate('organizer', 'name email');

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

export const DeleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizer = req.user.id; // Get organizer ID from authenticated request

        // Find event and verify ownership
        const event = await Event.findOne({ _id: id, organizer });
        if (!event) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        await event.deleteOne();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

export const GetEventParticipants = async (req, res) => {
    try {
        const { id } = req.params;
        const organizer = req.user.id; // Get organizer ID from authenticated request

        // Find event and verify ownership
        const event = await Event.findOne({ _id: id, organizer });
        if (!event) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        // Get all registrations for this event and populate user details
        const registrations = await Registration.find({ eventId: id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 }); // Sort by registration date, newest first

        // Transform the data to include only necessary participant information
        const participants = registrations.map(reg => ({
            _id: reg._id,
            name: reg.userId.name,
            email: reg.userId.email,
            registrationDate: reg.createdAt
        }));

        res.status(200).json({ 
            message: 'Participants fetched successfully', 
            participants 
        });
    } catch (error) {
        console.error('Get event participants error:', error);
        res.status(500).json({ 
            message: 'Error fetching event participants', 
            error: error.message 
        });
    }
};
