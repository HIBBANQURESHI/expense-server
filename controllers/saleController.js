import mongoose from 'mongoose'
import Sale from '../models/Sale.js'

// Get all sales
const getSales = async (req, res) => {
    const sale = await Sale.find({}).sort({createdAt: -1})
    res.status(200).json(sale)
};

// Get a single sale
const getSale = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Sale Found"})
    }
    const sale = await Sale.findById({_id: id})
    if(!sale){
        return res.status(400).json({error: "No Sale Found"})
    }
    res.status(200).json(sale)
};

// Create Sale
const createSale = async (req, res) => {
    const { name, description, amount } = req.body;
    try {
        const sale = await Sale.create({name, description, amount})
        res.status(200).json(sale)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Sale
const deleteSale = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Sale Found"})
    }

    const sale = await Sale.findByIdAndDelete({_id: id})
    if(!sale){
        return res.status(400).json({error: "No Sale Found"})
    }

    res.status(200).json(sale)
};

//Update Sale
const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount } = req.body;
        const sale = await Sale.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount
        });
        return res.status(200).json(sale)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

export {getSales, getSale, createSale, deleteSale, updateSale}