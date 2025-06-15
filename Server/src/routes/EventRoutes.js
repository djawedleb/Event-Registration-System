import express from 'express';
import {AddEvent, GetEvents, GetEventById, UpdateEvent, DeleteEvent} from '../controllers/EventController.js';
import { validateEvent } from '../middleware/authMiddleware.js';
const EventRoutes = express.Router();

EventRoutes.post('/AddEvent', validateEvent, AddEvent);
EventRoutes.get('/GetEvents', GetEvents);
EventRoutes.get('/GetEventById/:id', GetEventById);
EventRoutes.put('/UpdateEvent/:id', UpdateEvent);
EventRoutes.delete('/DeleteEvent/:id', DeleteEvent);

export default EventRoutes;