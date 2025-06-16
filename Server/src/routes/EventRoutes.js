import express from 'express';
import {
    AddEvent,
    GetEvents,
    GetEventById,
    UpdateEvent,
    DeleteEvent,
    GetMyEvents,
    GetEventParticipants
} from '../controllers/EventController.js';
import { authenticateToken, validateEvent } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const EventRoutes = express.Router();

// Public routes
EventRoutes.get('/GetEvents', GetEvents);
EventRoutes.get('/GetEventById/:id', GetEventById);

// Protected routes (require authentication)
EventRoutes.get('/GetMyEvents', authenticateToken, GetMyEvents);
EventRoutes.post('/CreateEvent', authenticateToken, upload.single('image'), validateEvent, AddEvent);
EventRoutes.put('/UpdateEvent/:id', authenticateToken, upload.single('image'), validateEvent, UpdateEvent);
EventRoutes.delete('/DeleteEvent/:id', authenticateToken, DeleteEvent);
EventRoutes.get('/GetEventParticipants/:id', authenticateToken, GetEventParticipants);

export default EventRoutes;