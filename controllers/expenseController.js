import mongoose from 'mongoose'
import Expense from '../models/Expense.js';

// Get all Expense
const getExpenses = async (req, res) => {
    const expense = await Expense.find({}).sort({createdAt: -1})
    res.status(200).json(expense)
};

// Get a single Expense
const getExpense = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }
    const expense = await Expense.findById({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }
    res.status(200).json(expense)
};

// Create Expense
const createExpense = async (req, res) => {
    const { name, description, amount } = req.body;
    try {
        const expense = await Expense.create({name, description, amount})
        res.status(200).json(expense)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Expense Found"})
    }

    const expense = await Expense.findByIdAndDelete({_id: id})
    if(!expense){
        return res.status(400).json({error: "No Expense Found"})
    }

    res.status(200).json(expense)
};

//Update Expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, amount } = req.body;
        const expense = await Expense.findByIdAndUpdate({_id: id}, {
            name,
            description,
            amount
        });
        return res.status(200).json(expense)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

export {getExpenses, getExpense, createExpense, deleteExpense, updateExpense}