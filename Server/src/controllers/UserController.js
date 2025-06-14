import User from '../models/User.js';

export const registerUser = async (req, res) => {
    const {name , email , password} = req.body;
    const user = await User.create({name , email , password});
    res.status(201).json({message : 'User registered successfully', user});
}

export const loginUser = async (req, res) => {
    const {email , password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(401).json({message: 'invalid credentials'});
    }
    res.status(200).json({message: 'Login successful', user});
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