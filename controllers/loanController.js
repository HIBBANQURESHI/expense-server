import mongoose from 'mongoose'
import Loan from '../models/Loans.js';

// Get all Loan
const getLoans = async (req, res) => {
    const loan = await Loan.find({}).sort({createdAt: -1})
    res.status(200).json(loan)
};

// Get a single Loan
const getLoan = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Loan Found"})
    }
    const loan = await Loan.findById({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }
    res.status(200).json(loan)
};

// Create Loan
const createLoan = async (req, res) => {
    const { description, amount, received, remaining } = req.body;
    try {
        const loan = await Loan.create({description, amount, received, remaining})
        res.status(200).json(loan)
    } catch (error) {
        res.status(400).json({error: error.message})        
    }
};

// Delete Loan
const deleteLoan = async (req, res) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "No Loan Found"})
    }

    const loan = await Loan.findByIdAndDelete({_id: id})
    if(!loan){
        return res.status(400).json({error: "No Loan Found"})
    }

    res.status(200).json(loan)
};

//Update Loan
const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, received, remaining } = req.body;
        const loan = await Loan.findByIdAndUpdate({_id: id}, {
            description,
            amount, 
            received,
            remaining
        });
        return res.status(200).json(loan)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

export {getLoans, getLoan, createLoan, deleteLoan, updateLoan}