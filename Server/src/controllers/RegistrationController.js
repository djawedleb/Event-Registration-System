import Registration from '../models/Registration.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

export const registerUser = async (req,res) =>{
    const {userId, eventId} = req.body;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if(!user || !event){
        res.status(404).json({message : 'User or event not found'});
    }
    const registration = await Registration.create({userId, eventId});
    res.status(201).json({message : 'Registration successful', registration});
}

export const getRegistrations = async (req,res) =>{
    const registrations = await Registration.find();
    res.status(200).json({message : 'Registrations fetched successfully', registrations});
}

export const deleteRegistration = async (req,res) =>{
    const {id} = req.params;
    const registration = await Registration.findByIdAndDelete(id);
    if(!registration){
        res.status(404).json({message : 'Registration not found'});
    }
    res.status(200).json({message : 'Registration deleted successfully', registration});
}