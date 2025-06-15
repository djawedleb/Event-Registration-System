import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );


        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

export const getUsers = async (req, res) => {
    const users = await User.find();
    if(!users){
        res.status(404).json({message: 'No users found'});
    }
    res.status(200).json({message: 'Users fetched successfully', users});
}

export const getUserById = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User fetched successfully', user});
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name , email , password} = req.body;
    const user = await User.findByIdAndUpdate(id , {name , email , password});
    if(!user){
        res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User updated successfully', user});
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User deleted successfully', user});
}