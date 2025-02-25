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
    const { name, amount, received, remaining } = req.body;
    try {
        const loan = await Loan.create({name, amount, received, remaining})
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
        const { name, amount, received, remaining } = req.body;
        const loan = await Loan.findByIdAndUpdate({_id: id}, {
            name,
            amount, 
            received,
            remaining
        });
        return res.status(200).json(loan)        
    } catch (error) {
        return res.status(400).json({error: error.message})        
    }
};

//getMonthlyLoan
const getMonthlyLoan = async (req, res) => {
    const { year, month } = req.params;

    if (!year || !month || isNaN(year) || isNaN(month)) {
        return res.status(400).json({ error: "Invalid year or month" });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const sales = await Loan.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).select("name createdAt amount received remaining");

        res.status(200).json(sales);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//getDailyLoan
const getDailyLoan = async (req, res) => {
    const { year, month, day } = req.params;

    try {
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

        const sales = await Loan.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).select("name createdAt amount received remaining");

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error in getDailyLoan:", error);
        res.status(500).json({ error: error.message });
    }
};


export {getLoans, getLoan, createLoan, deleteLoan, updateLoan, getMonthlyLoan, getDailyLoan}