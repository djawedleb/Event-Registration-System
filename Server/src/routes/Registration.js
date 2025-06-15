import express from 'express';
import {registerUser, getRegistrations, deleteRegistration, checkRegistration} from '../controllers/RegistrationController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const RegistrationRoutes = express.Router();

// All registration routes require authentication
RegistrationRoutes.post('/Register', authenticateToken, registerUser);
RegistrationRoutes.get('/Registrations', authenticateToken, getRegistrations);
RegistrationRoutes.delete('/Registrations/:id', authenticateToken, deleteRegistration);
RegistrationRoutes.get('/check/:eventId', authenticateToken, checkRegistration);

export default RegistrationRoutes;