import mongoose from 'mongoose'
import Parcel from '../models/Parcel.js';

// Get all Parcel
const getParcels = async (req, res) => {
    const parcel = await Parcel.find({}).sort({createdAt: -1})
    res.status(200).json(parcel)
};

// Get a single Parcel
const getParcel = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Parcel Found"})
    }
    const parcel = await Parcel.findById({_id: id})
    if(!parcel){
        return res.status(400).json({error: "No Parcel Found"})
    }
    res.status(200).json(parcel)
};

// Create Parcel
const createParcel = async (req, res) => {
    const { name, description, amount } = req.body;
    try {
        const parcel = await Parcel.create({name, description, amount})
        res.status(200).json(parcel)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Parcel
const deleteParcel = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Parcel Found"})
    }

    const parcel = await Parcel.findByIdAndDelete({_id: id})
    if(!parcel){
        return res.status(400).json({error: "No Parcel Found"})
    }

    res.status(200).json(parcel)
};

//Update Parcel
const updateParcel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount } = req.body;
        const parcel = await Parcel.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount
        });
        return res.status(200).json(parcel)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

export {getParcels, getParcel, createParcel, deleteParcel, updateParcel}