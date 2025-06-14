import express from 'express';
import {registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser} from '../controllers/UserController.js';
const router = express.Router();

router.post('/Register', registerUser);
router.post('/Login', loginUser);
router.get('/Users', getUsers);
router.get('/Users/:id', getUserById);
router.put('/Users/:id', updateUser);
router.delete('/Users/:id', deleteUser);

export default router;
