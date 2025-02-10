import mongoose from 'mongoose'
import Delivery from '../models/Delivery.js'

// Get all deliverys
const getDeliveries = async (req, res) => {
    const delivery = await Delivery.find({}).sort({createdAt: -1})
    res.status(200).json(delivery)
};

// Get a single delivery
const getDelivery = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }
    const delivery = await Delivery.findById({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }
    res.status(200).json(delivery)
};

// Create Delivery
const createDelivery = async (req, res) => {
    const { name, description, amount } = req.body;
    try {
        const delivery = await Delivery.create({name, description, amount})
        res.status(200).json(delivery)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Delivery
const deleteDelivery = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Delivery Found"})
    }

    const delivery = await Delivery.findByIdAndDelete({_id: id})
    if(!delivery){
        return res.status(400).json({error: "No Delivery Found"})
    }

    res.status(200).json(delivery)
};

//Update Delivery
const updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount } = req.body;
        const delivery = await Delivery.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount
        });
        return res.status(200).json(delivery)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

export {getDeliveries, getDelivery, createDelivery, deleteDelivery, updateDelivery}