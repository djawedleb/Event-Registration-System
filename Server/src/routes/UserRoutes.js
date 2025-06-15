import express from 'express';
import {registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser} from '../controllers/UserController.js';
import {authenticateToken, validateRegistration} from '../middleware/authMiddleware.js';
const UserRoutes = express.Router();

UserRoutes.post('/Register', validateRegistration, registerUser);
UserRoutes.post('/Login', loginUser);
UserRoutes.get('/Users', authenticateToken, getUsers);
UserRoutes.get('/Users/:id', authenticateToken, getUserById);
UserRoutes.put('/Users/:id', authenticateToken, updateUser);
UserRoutes.delete('/Users/:id', authenticateToken, deleteUser);

export default UserRoutes;
