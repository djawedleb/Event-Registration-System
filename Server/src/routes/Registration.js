import express from 'express';
import {registerUser, getRegistrations, deleteRegistration} from '../controllers/RegistrationController.js';

const RegistrationRoutes = express.Router();

RegistrationRoutes.post('/Register', registerUser);
RegistrationRoutes.get('/Registrations', getRegistrations);
RegistrationRoutes.delete('/Registrations/:id', deleteRegistration);

export default RegistrationRoutes;