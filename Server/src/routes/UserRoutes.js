import express from 'express';
import {registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser, getProfile, updateProfile, deleteProfile} from '../controllers/UserController.js';
import {authenticateToken, validateRegistration} from '../middleware/authMiddleware.js';
const UserRoutes = express.Router();

// Auth routes
UserRoutes.post('/Register', validateRegistration, registerUser);
UserRoutes.post('/Login', loginUser);

// Profile management routes (protected)
UserRoutes.get('/profile', authenticateToken, getProfile);
UserRoutes.put('/profile', authenticateToken, updateProfile);
UserRoutes.delete('/profile', authenticateToken, deleteProfile);

// Admin routes (protected)
UserRoutes.get('/Users', authenticateToken, getUsers);
UserRoutes.get('/Users/:id', authenticateToken, getUserById);
UserRoutes.put('/Users/:id', authenticateToken, updateUser);
UserRoutes.delete('/Users/:id', authenticateToken, deleteUser);

export default UserRoutes;
