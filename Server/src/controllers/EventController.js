import Event from "../models/Event.js";

export const AddEvent = async (req,res) =>{
    const {name , description , location , date , time , image , price} = req.body;
    const event = await Event.create({name , description , location , date , time , image , price});
    res.status(201).json({message : 'Event added successfully', event});
}

export const GetEvents = async (req,res) =>{
    const events = await Event.find();
    if(!events){
        res.status(404).json({message : 'No events found'});
    }
    res.status(200).json({message : 'Events fetched successfully', events});
}

export const GetEventById = async (req,res) =>{
    const {id} = req.params;
    const event = await Event.findById(id);
    if(!event){
        res.status(404).json({message : 'Event not found'});
    }
    res.status(200).json({message : 'Event fetched successfully', event});
}

export const UpdateEvent = async (req,res) =>{
    const {id} = req.params;
    const {name , description , location , date , time , image , price} = req.body;
    const event = await Event.findByIdAndUpdate(id , {name , description , location , date , time , image , price});
    if(!event){
        res.status(404).json({message : 'Event not found'});
    }
    res.status(200).json({message : 'Event updated successfully', event});
}

export const DeleteEvent = async (req,res) =>{
    const {name , description , location , date , time , image , price} = req.body;
    const event = await Event.findByIdAndUpdate(id , {name , description , location , date , time , image , price});
    if(!event){
        res.status(404).json({message : 'Event not found'});
    }
    res.status(200).json({message : 'Event updated successfully', event});
}
